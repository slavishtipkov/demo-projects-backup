import { HttpApi } from "@dtn/api-lib";
import * as moment from "moment-timezone";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GetThresholdSettings, Location, StationOutlook, ThresholdSettings } from "../interfaces";

export default class ApiService extends HttpApi {
  fetchSprayOutlook(locations: ReadonlyArray<Location>): Observable<ReadonlyArray<StationOutlook>> {
    let stationIds = locations.map(l => l.stationId).join(",");
    let baseUrl = `${this.baseUrl}/sprayoutlook/forecasts`;
    let queryParams = `?stationIds=${stationIds}&numDays=7&includeHours=true`;
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<StationOutlook>),
      map(sprayOutlook => normalizeSprayOutlook(sprayOutlook, locations)),
    );
  }

  fetchThresholdSettings(): Observable<GetThresholdSettings | undefined> {
    return this.getJson(`${this.baseUrl}/sprayoutlook/thresholds`).pipe(
      map(res => {
        if (Array.isArray(res)) {
          if (res.length === 0) {
            return undefined;
          } else {
            return res[0] as GetThresholdSettings;
          }
        }
      }),
    );
  }

  fetchThresholdDefaults(): Observable<GetThresholdSettings> {
    return this.getJson(`${this.baseUrl}/sprayoutlook/thresholds/defaults`).pipe(
      map(response => response as GetThresholdSettings),
    );
  }

  saveThresholdSettings(settings: ThresholdSettings): Observable<GetThresholdSettings> {
    let request = settings.id
      ? this.putJson(`${this.baseUrl}/sprayoutlook/thresholds/${settings.id}`, settings)
      : this.postJson(`${this.baseUrl}/sprayoutlook/thresholds`, settings);

    return request.pipe(map(response => response as GetThresholdSettings));
  }
}

function normalizeSprayOutlook(
  sprayOutlooks: ReadonlyArray<StationOutlook>,
  locations: ReadonlyArray<Location>,
): ReadonlyArray<StationOutlook> {
  return locations
    .filter(location => sprayOutlooks.find(outlook => outlook.station.id === location.stationId))
    .map(location => {
      let outlook = sprayOutlooks.find(
        outlook => outlook.station.id === location.stationId,
      ) as StationOutlook;

      return {
        ...outlook,
        location,
        nextSprayRecDate:
          // @ts-ignore
          outlook.nextSprayRecDate === ""
            ? null
            : moment(outlook.nextSprayRecDate as moment.Moment).tz(outlook.station.timezoneId),
        days: outlook.days.map(d => ({
          ...d,
          date: moment(d.date).tz(outlook.station.timezoneId),
          sunrise: moment(d.sunrise).tz(outlook.station.timezoneId),
          sunset: moment(d.sunset).tz(outlook.station.timezoneId),
          hours: d.hours.map(h => ({
            ...h,
            dateTime: moment(h.dateTime).tz(outlook.station.timezoneId),
          })),
        })),
      };
    });
}
