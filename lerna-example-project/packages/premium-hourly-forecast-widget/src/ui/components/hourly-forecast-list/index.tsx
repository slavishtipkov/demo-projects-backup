import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import {
  HourlyForecast,
  ObservedAt,
  VisibleFields,
  DayForecast,
  PrecipType,
} from "../../../interfaces";
import styled, { css } from "../../../styled-components";
import HourlyForecastListItem from "../../components/hourly-forecast-list-item";
import LoadingIndicator from "../../components/loader";
import ErrorContainer from "../../components/error-container";
import FooterContainer from "../../components/footer";
import { ERRORS, ALLOWED_HOURS } from "../../../constants";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";
import { max, bufferCount, mergeMap } from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";
import { Consumer as I18nConsumer } from "../../../i18n";
import * as moment from "moment-timezone";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

const Wrapper = styled("div")`
  font-size: 14px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  max-width: 2014px;
  background: #ffffff;
  padding: 0 10px 10px 10px;
  text-align: left;

  .hourly-data {
    margin-left: -10px;
    margin-right: -10px;
  }
`;

export interface HeaderWidgetsWrapperProps {
  readonly widgetContainerWidth: number;
}

const HeaderWidgetsWrapper = styled<HeaderWidgetsWrapperProps, "div">("div")`
  display: flex;
  width: 100%;
  align-items: baseline;

  ${({ widgetContainerWidth }) =>
    widgetContainerWidth < 665 &&
    css`
      display: block;
    `};
`;

export interface WidgetItemWrapperProps {
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly widgetContainerWidth: number;
}

const WidgetZipCodeWrapper = styled<WidgetItemWrapperProps, "div">("div")`
  width: ${({ widgetContainerWidth, showStationSelect, showZipCode }) =>
    widgetContainerWidth > 665 && showStationSelect && showZipCode ? `50%` : `100%`};
  display: ${({ showZipCode }) => !showZipCode && "none"};

  ${({ showStationSelect, showZipCode, widgetContainerWidth }) =>
    showZipCode &&
    showStationSelect &&
    widgetContainerWidth > 665 &&
    css`
      &:last-of-type {
        margin-left: 10px;
      }
    `};

  & > div {
    margin: 10px 0 !important;
  }

  & .stationWrapper {
    margin-top: 0 !important;
    padding: 0 3px !important;
  }

  ${({ widgetContainerWidth }) =>
    widgetContainerWidth < 665 &&
    css`
      width: 100%;
      padding-top: 0 !important;
      margin-left: 0 !important;

      & .stationWrapper {
        margin: -15px 0 20px 0 !important;
      }
    `};

  ${({ widgetContainerWidth, showZipCode }) =>
    widgetContainerWidth < 665 &&
    !showZipCode &&
    css`
      & .stationWrapper {
        margin: 9px 0 20px 0 !important;
      }
    `};
`;

const WidgetLocationSelectWrapper = styled<WidgetItemWrapperProps, "div">("div")`
  width: ${({ widgetContainerWidth, showStationSelect, showZipCode }) =>
    widgetContainerWidth > 665 && showStationSelect && showZipCode ? `50%` : `100%`};
  display: ${({ showStationSelect }) => !showStationSelect && "none"};

  ${({ showStationSelect, showZipCode }) =>
    showZipCode &&
    showStationSelect &&
    css`
      width: 50%;

      &:last-of-type {
        margin-left: 10px;
      }
    `};

  & > div {
    margin: 10px 0 !important;
  }

  & .stationWrapper {
    margin-top: 0 !important;
    padding: 0 3px !important;
  }

  ${({ widgetContainerWidth }) =>
    widgetContainerWidth < 665 &&
    css`
      width: 100%;
      padding-top: 0 !important;
      margin-left: 0 !important;

      & .stationWrapper {
        margin: -15px 0 20px 0 !important;
      }
    `};

  ${({ widgetContainerWidth, showZipCode }) =>
    widgetContainerWidth < 665 &&
    !showZipCode &&
    css`
      & .stationWrapper {
        margin: 9px 0 20px 0 !important;
      }
    `};
`;

const HourContainer = styled("div")`
  display: flex;
  height: auto;
  color: #003764;
`;

const OverflowContainer = styled("div")`
  overflow-y: hidden;
  overflow-x: auto;
`;

export interface HourForecastContainerProps {
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
}

const HourForecastContainer = styled<HourForecastContainerProps, "div">("div")`
  display: flex;
  border: 0.5px solid #d5d5d6;
  margin-top: ${({ showStationSelect, showZipCode }) =>
    !showStationSelect && !showZipCode && "20px"};
`;

const LegendContainer = styled("div")`
  min-width: 140px;
  color: #95989a;
  border-right: 0.5px solid #d5d5d6;
`;

export interface LegendItemProps {
  readonly field: string;
  readonly weatherDescriptionHeight: number;
  readonly precipTypeHeight: number;
  readonly degHeight: number;
  readonly precipAmountHeight: number;
}

const LegendItem = styled<LegendItemProps, "p">("p")`
  padding: 10px 0 10px 15px;
  margin: 0;
  box-sizing: content-box !important;

  ${({ field, weatherDescriptionHeight }) =>
    field === "skyCover" &&
    css`
      height: ${weatherDescriptionHeight}px;
    `};

  ${({ field, precipTypeHeight }) =>
    field === "precipType" &&
    css`
      height: ${precipTypeHeight}px;
    `};

  ${({ field, degHeight }) =>
    field === "temp_feelsLike" &&
    css`
      height: ${degHeight}px;
    `};

  ${({ field, precipAmountHeight }) =>
    field === "precipAmount" &&
    css`
      height: ${precipAmountHeight}px;
    `};
`;

export interface HeaderItemProps {
  readonly width: number;
}

const HeaderItem = styled<HeaderItemProps, "p">("p")`
  color: #003764;
  margin: 0;
  padding: 5px 0 10px 15px;
  border-right: 0.5px solid #d5d5d6;
  box-sizing: content-box !important;

  &:last-of-type {
    border: none;
  }

  ${({ width }) =>
    width &&
    css`
      min-width: ${width}px;
      max-width: ${width}px;
    `};

  ${({ width }) =>
    width &&
    width <= 168 &&
    css`
      padding: 2px 0 10px 15px;
    `};

  ${({ width }) =>
    width &&
    width <= 74 &&
    css`
      padding: 2px 3px 10px 2px;
    `};
`;

const DayHeader = styled("div")`
  height: 36px;
  display: inline-flex;
`;

export interface Props {
  readonly weatherForecastData: ReadonlyArray<HourlyForecast>;
  readonly dayForecastData?: ReadonlyArray<DayForecast>;
  readonly visibleFields: VisibleFields;
  readonly units?: string;
  readonly loading: boolean;
  readonly error?: string;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly showHourlyForecast: boolean;
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly timezone?: string;

  readonly setError: (error: string) => void;
}

export interface State {
  readonly weatherDescriptionHeight: number;
  readonly precipTypeHeight: number;
  readonly widgetContainerWidth: number;
  readonly degHeight: number;
  readonly precipAmountHeight: number;
}

export default class extends React.Component<Props, State> {
  private readonly weatherDescriptionSubject: Subject<number> = new Subject();
  private readonly weatherSubscription: Subscription;
  private readonly precipTypeSubject: Subject<number> = new Subject();
  private readonly precipTypeSubscription: Subscription;
  private widgetContainerRef: any;
  private readonly weatherDegSubject: Subject<number> = new Subject();
  private readonly weatherDegSubscription: Subscription;
  private readonly precipAmountSubject: Subject<number> = new Subject();
  private readonly precipAmountSubscription: Subscription;

  // tslint:disable-next-line:member-ordering
  constructor(props: Props, state: State) {
    super(props, state);
    const defaultWeatherDescriptionHeight = 0;
    const paddingWrapper = 9.6;
    this.state = {
      weatherDescriptionHeight: defaultWeatherDescriptionHeight,
      precipTypeHeight: defaultWeatherDescriptionHeight,
      widgetContainerWidth: 0,
      degHeight: defaultWeatherDescriptionHeight,
      precipAmountHeight: defaultWeatherDescriptionHeight,
    };
    this.weatherSubscription = this.weatherDescriptionSubject
      .asObservable()
      .pipe(
        bufferCount<number>(ALLOWED_HOURS),
        mergeMap(arr => {
          return of(...arr).pipe(max());
        }),
      )
      .subscribe((maxHeight: number) =>
        this.setState({ weatherDescriptionHeight: maxHeight - 2 * paddingWrapper }),
      );

    this.precipTypeSubscription = this.precipTypeSubject
      .asObservable()
      .pipe(
        bufferCount<number>(ALLOWED_HOURS),
        mergeMap(arr => {
          return of(...arr).pipe(max());
        }),
      )
      .subscribe((maxHeight: number) =>
        this.setState({ precipTypeHeight: maxHeight - 2 * paddingWrapper }),
      );

    this.weatherDegSubscription = this.weatherDegSubject
      .asObservable()
      .pipe(
        bufferCount<number>(ALLOWED_HOURS),
        mergeMap(arr => {
          return of(...arr).pipe(max());
        }),
      )
      .subscribe((maxHeight: number) => {
        this.setState({ degHeight: maxHeight - 2 * paddingWrapper });
      });

    this.precipAmountSubscription = this.precipAmountSubject
      .asObservable()
      .pipe(
        bufferCount<number>(ALLOWED_HOURS),
        mergeMap(arr => {
          return of(...arr).pipe(max());
        }),
      )
      .subscribe((maxHeight: number) => {
        this.setState({ precipAmountHeight: maxHeight - 2 * paddingWrapper });
      });
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      JSON.stringify(this.props.weatherForecastData) !==
      JSON.stringify(nextProps.weatherForecastData)
    ) {
      const defaultWeatherDescriptionHeight = 0;
      this.setState({
        weatherDescriptionHeight: defaultWeatherDescriptionHeight,
        precipTypeHeight: defaultWeatherDescriptionHeight,
        degHeight: defaultWeatherDescriptionHeight,
        precipAmountHeight: defaultWeatherDescriptionHeight,
      });
    }
  }

  componentDidMount(): void {
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
    window.addEventListener("resize", this.handleWidgetResize);
  }

  componentWillUnmount(): void {
    this.weatherSubscription.unsubscribe();
    this.precipTypeSubscription.unsubscribe();
    this.weatherDegSubscription.unsubscribe();
    this.precipAmountSubscription.unsubscribe();
    window.removeEventListener("resize", this.handleWidgetResize);
  }

  renderWeatherForecast = () => {
    return this.props.weatherForecastData.map((hourlyForecast, index) => {
      return (
        <HourlyForecastListItem
          hourlyForecastData={hourlyForecast}
          visibleFields={this.props.visibleFields}
          key={index}
          units={this.props.units}
          index={index}
          weatherSubject={this.weatherDescriptionSubject}
          descriptionHeight={this.state.weatherDescriptionHeight}
          precipTypeSubject={this.precipTypeSubject}
          precipTypeHeight={this.state.precipTypeHeight}
          precipAmountSubject={this.precipAmountSubject}
          precipAmountHeight={this.state.precipAmountHeight}
          weatherDegSubject={this.weatherDegSubject}
          degHeight={this.state.degHeight}
          endOfDay={this.getEndOfDay(index)}
          dayForecastData={this.props.dayForecastData}
          timezone={this.props.timezone}
          precipData={this.getPrecipData(hourlyForecast.precipitation)}
        />
      );
    });
  };

  getPrecipData = (precipData?: ReadonlyArray<PrecipType>) => {
    if (precipData !== undefined && precipData.length !== 0) {
      const rainObject = precipData.find(p => p.type.toLocaleLowerCase() === "rain");
      const snowObject = precipData.find(p => p.type.toLocaleLowerCase() === "snow");
      const iceObject = precipData.find(p => p.type.toLocaleLowerCase() === "freezing rain");

      const quantityOfLiquid = rainObject ? rainObject.amount : 0;
      const quantityOfIce = iceObject ? iceObject.amount : 0;
      const quantityOfSnow = snowObject ? snowObject.amount : 0;

      let precipType: string | undefined = "";
      let precipAmount: string | undefined = "";
      let precipChance: string | undefined = rainObject ? `${rainObject.probability}` : "0";

      if (quantityOfLiquid === 0) {
        if (quantityOfLiquid === 0 && parseFloat(`${precipChance}`) !== 0) {
          precipType = "rain";
          precipAmount = `L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
        } else {
          precipType = undefined;
          precipAmount = undefined;
          precipChance = undefined;
        }
      } else if (parseFloat(`${quantityOfSnow}`) !== 0) {
        precipType = "snow";
        precipAmount = `S: ${this.getFormatedSnowQuantity(
          quantityOfSnow,
        )} ${this.precipitationAmountUnits()} L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
      } else if (parseFloat(`${quantityOfIce}`) !== 0) {
        precipType = "freezing_rain";
        precipAmount = `I: ${quantityOfIce} ${this.precipitationAmountUnits()} L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
      } else {
        precipType = "rain";
        precipAmount = `L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
      }

      return { precipType, precipAmount, precipChance };
    }
    return { precipType: undefined, precipAmount: undefined, precipChance: undefined };
  };

  precipitationAmountUnits = () => {
    return this.props.units && this.props.units.toLowerCase() === "metric" ? "mm" : "in";
  };

  getFormatedSnowQuantity = (quantityOfSnow: number) => {
    return this.props.units && this.props.units.toLowerCase() === "metric"
      ? this.formatMetricSnowRange(quantityOfSnow)
      : this.formatImperialSnowRange(quantityOfSnow);
  };

  formatImperialSnowRange = (quantityOfSnow: number) => {
    if (quantityOfSnow <= 0) {
      return "0";
    }
    if (quantityOfSnow < 0.25) {
      return "<1/4";
    }
    if (quantityOfSnow < 1) {
      return "1/4-1";
    }
    if (quantityOfSnow < 3) {
      return "1-3";
    }
    if (quantityOfSnow < 5) {
      return "3-5";
    }
    if (quantityOfSnow < 7) {
      return "5-7";
    }
    if (quantityOfSnow < 10) {
      return "7-10";
    }
    if (quantityOfSnow < 13) {
      return "10-13";
    }
    if (quantityOfSnow < 15) {
      return "13-15";
    }
    return "15+";
  };

  formatMetricSnowRange = (quantityOfSnow: number) => {
    if (quantityOfSnow <= 0) {
      return "0";
    }
    if (quantityOfSnow < 1) {
      return "<1";
    }
    if (quantityOfSnow < 3) {
      return "1-3";
    }
    if (quantityOfSnow < 6) {
      return "3-6";
    }
    if (quantityOfSnow < 10) {
      return "6-10";
    }
    if (quantityOfSnow < 20) {
      return "10-20";
    }
    if (quantityOfSnow < 30) {
      return "20-30";
    }
    return ">30";
  };

  renderHeaderRow = () => {
    const todayIndex = 0;
    const days: {
      [key: string]: { readonly weekday: number; readonly month: number; readonly date: number };
    } = {};
    this.props.weatherForecastData.forEach(hourlyForecast => {
      let newDay = this.props.timezone
        ? moment(hourlyForecast.utcTime).tz(this.props.timezone)
        : moment(hourlyForecast.utcTime);
      days[`${moment(newDay).format("YYYYMMDD")}`] = {
        weekday: newDay.weekday(),
        month: newDay.month(),
        date: newDay.date(),
      };
    });
    return Object.keys(days).map((key, index) => (
      <I18nConsumer key={index}>
        {({ t }) => (
          <HeaderItem width={this.getHeaderWidth(days[key].date.toString())}>
            {index === 0 ? `${t(`days.${todayIndex}`)}, ` : `${t(`days.${days[key].weekday}`)}, `}
            {this.getHeaderWidth(days[key].date.toString()) <= 90
              ? `${t(`monthsShort.${days[key].month}`)} `
              : `${t(`months.${days[key].month}`)} `}
            {days[key].date}
          </HeaderItem>
        )}
      </I18nConsumer>
    ));
  };

  renderLegendCol = () => {
    const activeFields = Object.keys(this.props.visibleFields).filter(key => {
      if (this.props.visibleFields[key]) {
        return key;
      }
    });
    return activeFields.map((field, index) => (
      <I18nConsumer key={index}>
        {({ t }) => (
          <LegendItem
            field={field}
            weatherDescriptionHeight={this.state.weatherDescriptionHeight}
            precipTypeHeight={this.state.precipTypeHeight}
            degHeight={this.state.degHeight}
            precipAmountHeight={this.state.precipAmountHeight}
          >
            {t(`legend.${field}`)}
          </LegendItem>
        )}
      </I18nConsumer>
    ));
  };

  render(): JSX.Element {
    return (
      // tslint:disable-next-line:jsx-no-lambda
      <Wrapper innerRef={ref => (this.widgetContainerRef = ref)}>
        <HeaderWidgetsWrapper widgetContainerWidth={this.state.widgetContainerWidth}>
          <WidgetZipCodeWrapper
            widgetContainerWidth={this.state.widgetContainerWidth}
            showZipCode={this.props.showZipCode}
            showStationSelect={this.props.showStationSelect}
          >
            <ZipCodeWidget.ZipCode theme={{}} />
          </WidgetZipCodeWrapper>
          <WidgetLocationSelectWrapper
            widgetContainerWidth={this.state.widgetContainerWidth}
            showZipCode={this.props.showZipCode}
            showStationSelect={this.props.showStationSelect}
          >
            <div className={"stationWrapper"}>
              <PremiumLocationSelectWidget.PremiumLocationSelect theme={{}} />
            </div>
          </WidgetLocationSelectWrapper>
        </HeaderWidgetsWrapper>
        {this.props.showHourlyForecast && this.generateContent()}
      </Wrapper>
    );
  }

  private readonly handleWidgetResize = (): void => {
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
  };

  private readonly generateContent = (): any => {
    if (this.props.loading) {
      return <LoadingIndicator />;
    } else if (this.props.error) {
      return <ErrorContainer error={this.props.error} />;
    } else if (this.props.weatherForecastData.length === 0) {
      // if no error is return but no forecast data is received - error message "No data message" is set
      this.props.setError(ERRORS.noDataErrorMessage.key);
      return <ErrorContainer error={this.props.error} />;
    } else {
      const legendCol = this.renderLegendCol();
      const hourForecast = this.renderWeatherForecast();
      const headerRow = this.renderHeaderRow();
      return (
        <Wrapper className="hourly-data">
          <HourForecastContainer
            showZipCode={this.props.showZipCode}
            showStationSelect={this.props.showStationSelect}
          >
            <LegendContainer>{legendCol}</LegendContainer>
            <OverflowContainer>
              <DayHeader> {headerRow} </DayHeader>
              <HourContainer>{hourForecast}</HourContainer>
            </OverflowContainer>
          </HourForecastContainer>
          <FooterContainer
            observedAt={this.props.observedAt}
            observedAtTime={this.props.observedAtTime}
          />
        </Wrapper>
      );
    }
  };

  private readonly getEndOfDay = (index: number): boolean => {
    if (this.props.weatherForecastData[index + 1]) {
      if (this.props.timezone) {
        return moment(this.props.weatherForecastData[index].utcTime)
          .tz(this.props.timezone)
          .date() !==
          moment(this.props.weatherForecastData[index + 1].utcTime)
            .tz(this.props.timezone)
            .date()
          ? true
          : false;
      }

      return moment(this.props.weatherForecastData[index].utcTime).date() !==
        moment(this.props.weatherForecastData[index].utcTime).date()
        ? true
        : false;
    }
    return false;
  };

  private readonly getHeaderWidth = (key: string): number => {
    const minHeaderWidth = 80;
    const colWidth = 94;
    const headerPadding = 15;
    const colsLength = this.props.weatherForecastData.filter(w => {
      if (
        this.props.timezone &&
        moment(w.utcTime)
          .tz(this.props.timezone)
          .date()
          .toString() === key
      ) {
        return w;
      } else if (
        !this.props.timezone &&
        moment(w.utcTime)
          .date()
          .toString() === key
      ) {
        return w;
      }
    }).length;

    if (colsLength * colWidth - headerPadding < minHeaderWidth) {
      return minHeaderWidth;
    }
    return colsLength * colWidth - headerPadding;
  };
}
