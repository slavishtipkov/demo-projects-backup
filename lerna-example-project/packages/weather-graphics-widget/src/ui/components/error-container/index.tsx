import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled from "../../../styled-components";
import Icon from "../icons";

const Error = styled("div")`
  font-size: 12px;
  padding-top: 5px;
  color: #ff4836;
  font-weight: 700;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;

  & > .error-wrapper {
    display: flex;

    & > .error-icon {
      padding-right: 3px;
    }
  }
`;

export interface Props {
  readonly error?: string | Blob;
}

export interface State {
  readonly parsedError?: string;
}

export default class ErrorContainer extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      parsedError: undefined,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.error !== this.props.error) {
      this.setState({ parsedError: undefined });
    }
  }

  render(): JSX.Element {
    if (!this.state.parsedError && this.props.error && typeof this.props.error !== "string") {
      this.getBlobErrorValue(this.props.error);
    }
    return (
      <I18nConsumer>
        {({ t }) => {
          return (
            <Error>
              <div className="error-wrapper">
                <span className="error-icon">
                  <Icon icon="error" color="#ff4836" width="14px" height="14px" wrapper="common" />
                </span>
                <span>
                  {" "}
                  {typeof this.props.error === "string"
                    ? t(`errors.${this.props.error}`)
                    : this.state.parsedError
                    ? t(`errors.${this.state.parsedError}`)
                    : ""}
                </span>
              </div>
            </Error>
          );
        }}
      </I18nConsumer>
    );
  }

  private readonly getBlobErrorValue = (error: Blob) => {
    this.convertBlobError(error)
      .then(result => {
        this.setState({
          parsedError: `Error: ${JSON.parse(result as string).messages[0].message}`,
        });
      })
      .catch(error => {
        this.setState({ parsedError: `Error: Problem with image file` });
      });
  };

  private readonly convertBlobError = async (
    errorBlob: Blob,
  ): Promise<string | ArrayBuffer | null> => {
    const temporaryFileReader = new FileReader();
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(errorBlob);
    });
  };
}
