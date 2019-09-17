import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";
import ArrowContainer from "../../icons/arrow-container";

const Wrapper = styled("div")`
  border-top: 1px solid #bfbfbf;
  border-bottom: 1px solid #bfbfbf;
  background: #ffffff;
  text-align: left;
  display: flex;
  height: 50px;
  flex-direction: row;

  &:last-of-type {
    border-bottom: none;
  }
`;

const HeaderText = styled("div")`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  position: relative;
  cursor: pointer;

  > .heading {
    font-size: 17px;
    color: #5a5a5c;
    padding-left: 20px;
    margin-top: 6px;
  }

  > .subheading {
    font-size: 12px;
    color: #afafb0;
  }
`;

export interface Props {
  readonly isExpanded: boolean;
  readonly heading: string;
  readonly toggleExpand: (containerName: string) => void;
}

export default class Header extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper>
            <HeaderText onClick={this.handleOnExpand}>
              <ArrowContainer isExpandedView={this.props.isExpanded} />
              <div className="heading">{this.props.heading}</div>
            </HeaderText>
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleOnExpand = () => {
    this.props.toggleExpand("moreInformation");
  };
}
