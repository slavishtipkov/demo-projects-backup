import { Units, init } from "../../../../../i18n-lib/dist";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import styled, {
  ThemeProvider,
  ThemeProp,
  StyledComponentClass,
  css,
} from "../../../styled-components";
import LoadingIndicator from "../../components/loader";
import {
  FetchMapImage,
  SetErrorMessageAction,
  SetMapSidebarState,
  SetMapsList,
} from "../../../store";
import ErrorContainer from "../../components/error-container";
import Icon from "../../components/icons";
import { MapsConfigInterface } from "../../../interfaces";
import MapSelect from "../../components/map-select";
import { getActiveMap } from "../../../store/utils";

export interface WrapperProps {
  readonly containerWidth: number;
  readonly mapImageHeight: number;
  readonly isMapSidebarVisible?: boolean;
}

const Wrapper = styled<WrapperProps, "div">("div")`
  font-size: 14px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  display: flex;
  border: 0.5px solid #d5d5d6;
  max-width: 916px;
  background: white;
  text-align: left;

  ${({ isMapSidebarVisible }) =>
    isMapSidebarVisible !== undefined &&
    !isMapSidebarVisible &&
    css`
      max-width: 641px;
      border: none;
    `};

  & .mapContainer {
    width: 100%;
    height: auto;
    max-width: 640px;
  }

  ${({ mapImageHeight }) =>
    mapImageHeight &&
    css`
      height: ${mapImageHeight}px !important;
    `};

  ${({ containerWidth }) =>
    containerWidth < 640 &&
    css`
      display: block;
      height: auto !important;
    `};
`;

export interface ListWrapperProps {
  readonly mapImageHeight: number;
}

const ListWrapper = styled<ListWrapperProps, "div">("div")`
  box-sizing: content-box !important;
  width: 30%;
  max-width: 350px;
  border-right: 0.5px solid #d5d5d6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ mapImageHeight }) =>
    mapImageHeight &&
    css`
      height: ${mapImageHeight}px !important;
    `};
`;

export interface ItemsContainerProps {
  readonly mapImageHeight: number;
}

const ItemsContainer = styled<ItemsContainerProps, "div">("div")`
  ${({ mapImageHeight }) =>
    mapImageHeight &&
    css`
      height: ${mapImageHeight}px !important;
      overflow-y: auto;
    `};
`;

export interface ListItemProps {
  readonly isActive: boolean;
}

const ListItem = styled<ListItemProps, "p">("p")`
  box-sizing: content-box !important;
  margin: 0;
  padding: 13px;
  border-bottom: 0.5px solid #d5d5d6;
  cursor: pointer;
  word-break: break-word;
  word-wrap: break-word;
  font-weight: 700;
  color: #004075;

  :first-child {
    margin-top: 0.5px;
  }

  &:hover {
    background-color: rgba(0, 147, 208, 0.1);
  }

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: #f1f1f1;
      margin-right: 0.5px;
    `};
`;

export interface LogoWrapperProps {
  readonly containerWidth: number;
}

const LogoWrapper = styled<LogoWrapperProps, "div">("div")`
  box-sizing: content-box !important;
  padding: 13px;

  .dtn {
    height: 20px;
  }

  ${({ containerWidth }) =>
    containerWidth < 640 &&
    css`
      padding: 6px;
    `};
`;

export interface MapWrapperProps {
  readonly isMapSidebarVisible?: boolean;
  readonly containerWidth: number;
  readonly mapImageHeight: number;
}

const MapWrapper = styled<MapWrapperProps, "div">("div")`
  box-sizing: content-box !important;
  width: 70%;
  max-width: 640px;

  ${({ mapImageHeight }) =>
    mapImageHeight &&
    css`
      height: ${mapImageHeight}px;
    `};

  ${({ isMapSidebarVisible, containerWidth }) =>
    (!isMapSidebarVisible || containerWidth < 640) &&
    css`
      width: 100%;
    `};

  ${({ containerWidth }) =>
    containerWidth < 640 &&
    css`
      height: auto !important;
    `};
`;

export interface Props {
  // Properties
  readonly theme?: ThemeProp;
  readonly loading: boolean;
  readonly error?: string | Blob;
  readonly maps: MapsConfigInterface;
  readonly defaultMap?: string;
  readonly isMapSidebarVisible?: boolean;
  readonly mapImageData?: string;
  // Functions
  readonly setActiveMap: (defaultMap: string) => FetchMapImage;
  readonly setMapSidebarState: (isMapSidebarVisible: boolean) => SetMapSidebarState;
  readonly setErrorMessage: (error: string) => SetErrorMessageAction;
  readonly setMapsList: (maps: MapsConfigInterface, defaultMap?: string) => SetMapsList;
}

export interface State {
  readonly widgetContainerWidth: number;
  readonly mapImageContainerHeight: number;
  readonly initLoading: boolean;
}

export default class IndexView extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      widgetContainerWidth: 0,
      mapImageContainerHeight: 0,
      initLoading: true,
    };
  }

  private widgetContainerRef: any;
  private mapImageRef: any;

  componentDidMount(): void {
    this.props.setActiveMap(getActiveMap(this.props.maps, this.props.defaultMap));

    if (this.mapImageRef) {
      this.setState({
        widgetContainerWidth: this.widgetContainerRef.clientWidth,
        mapImageContainerHeight: this.mapImageRef.clientHeight,
      });
    } else {
      this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
    }

    window.addEventListener("resize", this.handleWidgetResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleWidgetResize);
  }

  render(): JSX.Element {
    return (
      <React.StrictMode>
        <I18nConsumer>
          {({ t }) => (
            <Wrapper
              // tslint:disable-next-line:jsx-no-lambda
              innerRef={ref => (this.widgetContainerRef = ref)}
              containerWidth={this.state.widgetContainerWidth}
              mapImageHeight={this.state.mapImageContainerHeight}
              isMapSidebarVisible={this.props.isMapSidebarVisible}
            >
              {this.props.isMapSidebarVisible && this.state.widgetContainerWidth >= 640 && (
                <ListWrapper mapImageHeight={this.state.mapImageContainerHeight}>
                  <ItemsContainer mapImageHeight={this.state.mapImageContainerHeight}>
                    {this.generateMapOptions()}
                  </ItemsContainer>
                  <LogoWrapper containerWidth={this.state.widgetContainerWidth}>
                    <img
                      className="dtn"
                      src="https://www.dtn.com/wp-content/uploads/2018/11/logo-dtn.png"
                    />
                  </LogoWrapper>
                </ListWrapper>
              )}
              {this.props.isMapSidebarVisible && this.state.widgetContainerWidth < 640 && (
                <MapSelect
                  theme={this.props.theme}
                  maps={this.props.maps}
                  defaultMap={this.props.defaultMap}
                  handleActiveMapChange={this.handleActiveMapChange}
                />
              )}
              <MapWrapper
                isMapSidebarVisible={this.props.isMapSidebarVisible}
                containerWidth={this.state.widgetContainerWidth}
                mapImageHeight={this.state.mapImageContainerHeight}
              >
                {this.props.loading && <LoadingIndicator />}
                {this.props.error && <ErrorContainer error={this.props.error} />}
                {this.props.mapImageData && !this.props.loading && (
                  <img
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={ref => (this.mapImageRef = ref)}
                    // tslint:disable-next-line:jsx-no-lambda
                    onLoad={() => this.onImageLoad()}
                    className="mapContainer"
                    src={this.props.mapImageData}
                    alt={this.props.defaultMap}
                  />
                )}
              </MapWrapper>
              {this.props.isMapSidebarVisible && this.state.widgetContainerWidth < 640 && (
                <LogoWrapper containerWidth={this.state.widgetContainerWidth}>
                  <img
                    className="dtn"
                    src="https://www.dtn.com/wp-content/uploads/2018/11/logo-dtn.png"
                  />
                </LogoWrapper>
              )}
            </Wrapper>
          )}
        </I18nConsumer>
      </React.StrictMode>
    );
  }

  private readonly generateMapOptions = () => {
    return Object.keys(this.props.maps)
      .filter(key => this.props.maps[key])
      .map((key: string, index: number) => {
        return (
          // tslint:disable-next-line:jsx-key
          <ListItem
            key={index}
            isActive={key === this.props.defaultMap}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => this.handleActiveMapChange(key)}
          >
            {`${key}`}
          </ListItem>
        );
      });
  };

  private readonly handleActiveMapChange = (selectedMap: string) => {
    this.props.setActiveMap(selectedMap);
  };

  private readonly handleWidgetResize = (): void => {
    if (this.mapImageRef) {
      this.setState({
        widgetContainerWidth: this.widgetContainerRef.clientWidth,
        mapImageContainerHeight: this.mapImageRef.clientHeight,
      });
    } else {
      this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
    }
  };

  private readonly onImageLoad = (): void => {
    if (this.state.initLoading) {
      this.setState({
        mapImageContainerHeight: this.mapImageRef.clientHeight,
        initLoading: false,
      });
    }
  };
}
