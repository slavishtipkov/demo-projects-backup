import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";
import { Positions } from "../../../../interfaces";
import * as moment from "moment-timezone";
import { MOBILE_WIDTH } from "../../../../constants";

export interface WrapperProps {
  readonly width: number;
}

const Wrapper = styled<WrapperProps, "div">("div")`
  flex-grow: 1;
  margin-right: ${({ width }) => (width <= MOBILE_WIDTH ? "0" : "35px")};
  margin-bottom: ${({ width }) => width <= MOBILE_WIDTH && "10px"};

  &:last-of-type {
    margin-right: 0;
  }
`;

const Table = styled("div")`
  border: 1px solid #bfbfbf;
`;

const Header = styled("div")`
  color: #ffffff;
  background-color: #00ae42;
  padding: 15px;
  text-align: center;
  font-size: 20px;
`;

const PeriodTitle = styled("div")`
  color: #cbcdce;
  font-size: 13px;
  margin-bottom: 5px;
`;

const Row = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid #bfbfbf;
  padding: 5px;

  &:last-of-type {
    border-bottom: none;
  }
`;

const ColHeading = styled("div")`
  font-weight: bold;
  font-size: 18px;
  text-align: left;
  color: #5a5a5c;
  padding-right: 10px;
  width: 120px;
  box-sizing: border-box;
`;

const ColValue = styled("div")`
  font-size: 14px;
  text-align: left;
  color: #5a5a5c;
  padding-top: 2px;
  box-sizing: border-box;
  width: 120px;
`;

export interface Props {
  readonly position: Positions;
  readonly width: number;
}

export interface State {}

export default class PositionTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper className="position-table" width={this.props.width}>
            <PeriodTitle>{this.props.position.periodTitle}</PeriodTitle>
            <Table>
              <Header>{`${this.calculateTotal()}% ${t("labels.sold")}`}</Header>
              {this.renderDetails()}
              <Row>
                <ColHeading>{`${t("labels.average")} = `}</ColHeading>
                <ColValue>
                  {Number(this.props.position.averagePrice) !== 0 &&
                    `$${this.props.position.averagePrice} (${
                      this.props.position.averagePriceDate
                    })`}
                </ColValue>
              </Row>
            </Table>
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly calculateTotal = () => {
    let total = 0;
    this.props.position.details
      .filter(d => d.type === "Sold")
      .map((detail, i) => {
        total += detail.percentage;
      });

    return total;
  };

  private readonly renderDetails = () => {
    return this.props.position.details.map((detail, i) => {
      return (
        <Row key={i}>
          <ColHeading>{`${detail.type} ${detail.percentage}%`}</ColHeading>
          <ColValue>{moment(detail.dateString).format("M-D-YY")}</ColValue>
        </Row>
      );
    });
  };
}
