import { Clock } from "@dtn/i18n-lib";
import { Moment } from "moment-timezone";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import { Location, Station, StationOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import RiskLabel from "../risk-label";

export const LocationName = styled.h1`
  font-size: 110%;
`;

export const Normal = styled.span`
  display: inline;
`;
export const Emphasized = styled.span`
  font-family: LatoBold, sans-serif;
  font-size: 14px;
`;
export const LargeText = styled.span`
  font-size: 16px;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

export interface NextSprayRecommendationProps {
  readonly when: Moment | null;
  readonly clock?: Clock;
  readonly bold?: boolean;
}
export const NextSprayRecommendation: React.SFC<NextSprayRecommendationProps> = ({
  when,
  clock,
  bold = false,
}) => {
  let time: string | undefined;
  let risk: { readonly value: string; readonly display: string };
  if (when === null) {
    risk = { value: "n/a", display: "" };
  } else {
    time =
      clock === Clock.TWENTY_FOUR_HOUR
        ? `${when.format("HH:mm zz, MMM D")}`
        : `${when.format("h:mmA zz, MMM D")}`;
    risk = { value: "low", display: "" };
  }
  let Label = bold ? Emphasized : Normal;
  let Text = bold ? LargeText : Normal;

  return (
    <I18nConsumer>
      {({ t }) => (
        <div data-testid="next-spray-recommendation">
          <Label>{t("common.nextSprayWindow")}</Label>
          <Text>
            <RiskLabel risk={risk}>
              {when === null ? t("common.noRecommendedSprayTime") : time}
            </RiskLabel>
          </Text>
        </div>
      )}
    </I18nConsumer>
  );
};

export interface ForecastStationProps {
  readonly station: Station;
  readonly location: Location;
  readonly bold?: boolean;
  readonly long?: boolean;
}
export const ForecastStation: React.SFC<ForecastStationProps> = ({
  station,
  location,
  bold = false,
  long = false,
}) => {
  let Label = bold ? Emphasized : Normal;
  let Text = bold ? LargeText : Normal;
  return (
    <I18nConsumer>
      {({ t }) => (
        <div data-testid="forecast-station">
          <Label>{t("common.station")}</Label>
          <Text>
            {long && `${station.name}, `} {station.id}{" "}
            {t("station.locationDistance", { distance: location.distanceFromStation })}
          </Text>
        </div>
      )}
    </I18nConsumer>
  );
};

export interface Props {
  readonly outlook: StationOutlook;
  readonly onSelect: (outlook: StationOutlook) => void;
  readonly clock?: Clock;
}

export const LocationInfo: React.SFC<Props> = props => {
  let { onSelect, outlook, clock } = props;
  let onLocationNameClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect(outlook);
  };
  return (
    <div data-testid="location-info">
      <LocationName>
        <a href="" onClick={onLocationNameClick}>
          {outlook.location.locationName}
        </a>
      </LocationName>
      <NextSprayRecommendation when={outlook.nextSprayRecDate} clock={clock} />
      <ForecastStation station={outlook.station} location={outlook.location} />
    </div>
  );
};

export default LocationInfo;
