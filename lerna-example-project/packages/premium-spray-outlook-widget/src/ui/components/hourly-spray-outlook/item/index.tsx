import * as moment from "moment-timezone";
import * as React from "react";
import { ICON_RISC_COLORS, WEATHER_CONDITIONS } from "../../../../constants";
import { Consumer as I18nConsumer } from "../../../../i18n";
import styled from "../../../../styled-components";
import Icon from "../../icons";
import ArrowContainer from "../../icons/arrow-container";
import HourlySprayOutlookListItemDetails from "./details";
import { SprayOutlookHourOutlook } from "@dtn/api-lib";
import { Units } from "@dtn/i18n-lib";

const Time = styled("div")`
  font-weight: bold;
  font-size: 14px;
  width: 80px;
`;

const Image = styled("div")`
  text-align: center;
  overflow: hidden;
`;
const Wrapper = styled("div")`
  position: relative;
`;

const Text = styled("div")`
  margin-left: 30px;
  font-size: 14px;
`;

export interface ItemProps {
  readonly riskColor: string;
  readonly isLastItem: boolean;
  readonly isExpanded: boolean;
}

const Item = styled<ItemProps, "div">("div")`
  border-left: 5px solid ${(p: { readonly riskColor: string }) => p.riskColor};
  border-bottom: ${({ isLastItem, isExpanded }) =>
    isLastItem && !isExpanded ? "none" : "1px solid #d5d5d6"};
  position: relative;

  .last {
    border-bottom: none;
  }
`;

const ItemContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 45px;
  padding: 0.3125em 1.5em;

  &:hover {
    cursor: pointer;
  }
`;

export interface Props {
  readonly units: Units;
  readonly sprayOutlookHour: SprayOutlookHourOutlook;
  readonly index: number;
  readonly isExpanded: boolean;
  readonly isLastItem: boolean;
  readonly toggleIsExpanded: (index: number) => void;
  readonly timezone: string;
  readonly generateWeatherIconWrapper: (dateTime: string, index: number) => string;
  readonly activeDay: number;
}

export default class HourlySprayOutlookListItem extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper>
            <Item
              riskColor={
                this.props.sprayOutlookHour.type === "OBSERVATION"
                  ? ICON_RISC_COLORS["n/a"]
                  : ICON_RISC_COLORS[this.props.sprayOutlookHour.risk.value]
              }
              onClick={this.toggleIsExpanded}
              isLastItem={this.props.isLastItem}
              isExpanded={this.props.isExpanded}
            >
              <ItemContainer>
                <Time>
                  {`${moment(this.props.sprayOutlookHour.dateTime)
                    .tz(this.props.timezone)
                    .format("hA")}`}
                </Time>
                <Image>
                  {this.props.sprayOutlookHour.weatherCondition.code !== null && (
                    <Icon
                      wrapper={this.props.generateWeatherIconWrapper(
                        this.props.sprayOutlookHour.dateTime.toString(),
                        this.props.activeDay,
                      )}
                      icon={this.props.sprayOutlookHour.weatherCondition.code.toString()}
                      color="currentColor"
                      width={"30px"}
                      height={"30px"}
                    />
                  )}
                </Image>
                <Text>{WEATHER_CONDITIONS[this.props.sprayOutlookHour.risk.value]}</Text>
                <ArrowContainer isExpandedView={this.props.isExpanded} />
              </ItemContainer>
            </Item>
            {this.props.isExpanded && (
              <HourlySprayOutlookListItemDetails
                sprayOutlookHour={this.props.sprayOutlookHour}
                units={this.props.units}
                generateWeatherIconWrapper={this.props.generateWeatherIconWrapper}
                index={this.props.activeDay}
              />
            )}
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly toggleIsExpanded = () => {
    this.props.toggleIsExpanded(this.props.index);
  };
}
