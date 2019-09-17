import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";

const Wrapper = styled("div")`
  margin-bottom: 10px;
`;
const ChartImage = styled("img")`
  width: 100%;
  max-width: 510px;
  height: auto;
  margin-bottom: 10px;
`;
const Title = styled("div")`
  color: rgb(175, 175, 176);
  margin-bottom: 5px;
  font-size: 15px;
`;
const Description = styled("div")`
  color: rgb(90, 90, 92);
  font-size: 13px;
`;

export interface Props {
  readonly key: number;
  readonly chartBlob?: { readonly url: string; readonly id: string };
  readonly title: string;
  readonly description: string;
}

export interface State {}

export default class Chart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper key={this.props.title}>
            {this.props.chartBlob ? (
              <ChartImage src={this.props.chartBlob.url} alt={this.props.title} />
            ) : (
              <div>{t("NO CHART IMAGE")}</div>
            )}

            <Title>{this.props.title}</Title>
            <Description>{this.props.description}</Description>
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }
}
