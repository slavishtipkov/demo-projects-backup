import { Clock } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { StationOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import LocationInfo from "../../components/location-info";
import OutlookBar from "../../components/outlook-bar";

const Info = styled.div`
  margin-bottom: 10px;

  @media (min-width: 768px) {
    float: left;
    width: 25%;
    margin-bottom: 0;
  }
`;

const Graphic = styled.div`
  @media (min-width: 768px) {
    float: left;
    width: 75%;
  }
`;

const Wrapper = styled.div`
  overflow: hidden;
`;

const ListItem = styled.li`
  display: block;
`;

const List = styled.ol`
  > * {
    overflow: hidden;
  }

  > ${ListItem} + ${ListItem} {
    margin-top: 15px;
  }
`;

export interface Props {
  readonly isMobile: boolean;
  readonly clock?: Clock;
  readonly outlooks: ReadonlyArray<StationOutlook>;
  readonly onOutlookSelect: (outlook: StationOutlook, date: moment.Moment) => void;
}

export default class extends React.Component<Props> {
  handleDaySelect = (outlook: StationOutlook, day: moment.Moment) => {
    this.props.onOutlookSelect(outlook, day);
  };

  handleOutlookSelect = (outlook: StationOutlook) => {
    this.props.onOutlookSelect(outlook, moment());
  };

  render(): JSX.Element {
    let { isMobile, outlooks, clock } = this.props;
    return (
      <List data-testid="daily-overview">
        {outlooks.map((outlook, index) => (
          <ListItem key={index}>
            <Wrapper>
              <Info>
                <LocationInfo outlook={outlook} onSelect={this.handleOutlookSelect} clock={clock} />
              </Info>
              <Graphic>
                <OutlookBar outlook={outlook} showDates onDaySelect={this.handleDaySelect} />
              </Graphic>
            </Wrapper>
          </ListItem>
        ))}
      </List>
    );
  }
}
