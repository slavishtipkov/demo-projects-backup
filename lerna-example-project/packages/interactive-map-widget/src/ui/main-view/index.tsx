import { ActiveLayerDescriptor, Camera, LayerDefinition, LayerId, Preset } from "@dtn/map-lib";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../i18n";
import { UiTheme } from "../../interfaces";
import styled, { ThemeProvider } from "../../styled-components";
import AvailableLayersList from "../available-layers-list";
import Legend, { LayerLegend } from "../legend";
import Menu from "../menu";
import PresetsList from "../presets-list";
import Sidebar, { SidebarOpenButton } from "../sidebar";
import Timeline from "../timeline";
import ZoomControls from "../zoom-controls";

export const MainViewContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    border: 0;
    font-family: Helvetica;
    font-size: 16px;
    font-weight: inherit;
    font-style: inherit;
    line-height: 1;
    vertical-align: baseline;
  }

  ul,
  li {
    list-style: none;
  }
`;

const Logo = styled.img`
  position: absolute;
  z-index: 2;
  width: 90px;
  top: 10px;
  right: 10px;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
`;

export interface Props extends Partial<Camera> {
  readonly addLayer: (layerId: LayerId) => void;
  readonly removeLayer: (layerId: LayerId) => void;
  readonly changeTheme: (theme: string) => void;
  readonly zoomOut: () => void;
  readonly zoomIn: () => void;
  readonly stopZoom: () => void;
  readonly removeAllLayers: () => void;
  readonly isAnimating: boolean;
  readonly startAnimation: () => void;
  readonly stopAnimation: () => void;
  readonly applyPreset: (presetName: string) => void;
  readonly presets: ReadonlyArray<Preset>;
  readonly layers: ReadonlyArray<LayerDefinition>;
  readonly activeLayerDescriptors: ReadonlyArray<ActiveLayerDescriptor>;
  readonly pointOfInterestCoordinates: ReadonlyArray<number>;
  readonly loadingLayers: ReadonlyArray<string>;
}

export interface State {
  readonly isSidebarOpen: boolean;
  readonly isTimelineOpen: boolean;
  readonly isLegendOpen: boolean;
  readonly containerWidth: number;
}

export default class MainView extends React.PureComponent<Props, State> {
  container = React.createRef<HTMLElement>();

  state: State = {
    isSidebarOpen: false,
    isTimelineOpen: false,
    isLegendOpen: false,
    containerWidth: 0,
  };

  componentDidMount(): void {
    if (!(this.container.current instanceof HTMLElement)) {
      return;
    }
    this.setState({ containerWidth: this.container.current.clientWidth });
    window.addEventListener("resize", this.handleWidgetResize);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.activeLayerDescriptors.length < 1 && this.state.isLegendOpen) {
      this.setState(state => ({ isLegendOpen: false }));
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleWidgetResize);
  }

  handleWidgetResize = () => {
    if (!(this.container.current instanceof HTMLElement)) {
      return;
    }
    this.setState({ containerWidth: this.container.current.clientWidth });
  };

  handleSidebarToggle = () => {
    this.setState(prevState => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }));
  };

  handleTimelineToggle = () => {
    this.setState(prevState => ({
      isTimelineOpen: !prevState.isTimelineOpen,
    }));
  };

  handleLayerSelection = (layerId: LayerId) => {
    this.props.addLayer(layerId);
  };

  handleLegendOpen = () => {
    this.setState(prevState => ({
      isLegendOpen: true,
    }));
  };

  handleLegendClose = () => {
    this.setState(prevState => ({
      isLegendOpen: false,
    }));
  };

  handleZoomIn = () => {
    this.props.zoomIn();
  };

  handleZoomOut = () => {
    this.props.zoomOut();
  };

  handleStopZoom = () => {
    this.props.stopZoom();
  };

  handleStartAnimation = () => {
    this.props.startAnimation();
  };

  handleApplyPreset = (presetName: string) => {
    this.props.applyPreset(presetName);
  };

  addLayer = (layerId: LayerId) => {
    this.props.addLayer(layerId);
  };

  removeLayer = (layerId: LayerId) => {
    this.props.removeLayer(layerId);
  };

  render(): JSX.Element {
    let activeLayers = this.props.layers.filter(l =>
      this.props.activeLayerDescriptors.find(a => a.layerId === l.id),
    );

    let ui;
    if (this.state.containerWidth < 620) {
      ui = UiTheme.COMPACT;
    } else if (this.state.containerWidth < 900) {
      ui = UiTheme.STANDARD;
    } else {
      ui = UiTheme.SPACIOUS;
    }

    let theme = { ui };

    return (
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <I18nConsumer>
            {({ t }) => (
              <MainViewContainer innerRef={this.container}>
                <Logo src="https://pre-cs-widget-docs.dtn.com/assets/img/logo-dtn-white.png" />

                <SidebarOpenButton onClick={this.handleSidebarToggle} theme={theme} />
                <Sidebar isOpen={this.state.isSidebarOpen} onClose={this.handleSidebarToggle}>
                  <Menu displayLabel={t("menu.allLayersLabel")} icon="layers">
                    <AvailableLayersList
                      layers={this.props.layers}
                      loadingLayers={this.props.loadingLayers}
                      activeLayerDescriptors={this.props.activeLayerDescriptors}
                      onAddLayer={this.props.addLayer}
                      onRemoveLayer={this.props.removeLayer}
                    />
                  </Menu>
                  <Menu displayLabel={t("menu.presetsLabel")} icon="presets">
                    <PresetsList
                      presets={this.props.presets}
                      onApplyPreset={this.handleApplyPreset}
                    />
                  </Menu>
                </Sidebar>

                {this.props.activeLayerDescriptors.length > 0 && (
                  <Legend
                    onOpen={this.handleLegendOpen}
                    onClose={this.handleLegendClose}
                    isOpen={this.state.isLegendOpen}
                    isSidebarOpen={this.state.isSidebarOpen}
                  >
                    {this.props.activeLayerDescriptors
                      .filter(({ legendUrls }) => Boolean(legendUrls))
                      .slice()
                      // tslint:disable-next-line
                      .sort((a, b) => {
                        if (a.layerId < b.layerId) return -1;
                        if (a.layerId > b.layerId) return 1;
                        return 0;
                      })
                      .map(({ layerId, legendUrls }) => (
                        <LayerLegend
                          key={layerId}
                          label={this.props.layers.find(({ id }) => id === layerId)!.displayLabel}
                          urls={legendUrls!}
                        />
                      ))}
                  </Legend>
                )}

                {theme.ui !== UiTheme.COMPACT && (
                  <ZoomControls
                    onZoomIn={this.handleZoomIn}
                    onZoomOut={this.handleZoomOut}
                    onStopZoom={this.handleStopZoom}
                    isLegendOpen={this.state.isLegendOpen}
                  />
                )}

                <Timeline
                  onStart={this.handleStartAnimation}
                  onStop={this.props.stopAnimation}
                  isOpen={this.state.isTimelineOpen}
                  isAnimating={this.props.isAnimating}
                  onClose={this.handleTimelineToggle}
                  showAnimationControls={
                    activeLayers.filter(l => Boolean(l.animation && l.animation.interval > 0))
                      .length > 0
                  }
                  activeLayerDescriptors={this.props.activeLayerDescriptors}
                  isLegendOpen={this.state.isLegendOpen}
                  isSidebarOpen={this.state.isSidebarOpen}
                />
              </MainViewContainer>
            )}
          </I18nConsumer>
        </ThemeProvider>
      </React.StrictMode>
    );
  }
}
