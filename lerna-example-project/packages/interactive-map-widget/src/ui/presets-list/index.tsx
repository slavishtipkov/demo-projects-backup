import { Preset as IPreset } from "@dtn/map-lib";
import * as React from "react";
import styled from "../../styled-components";

const PresetList = styled.ul`
  && {
    padding: 10px 0 0 60px;
    margin-bottom: 20px;
  }
`;

const Preset = styled.div`
  && {
    padding: 6px 0;
  }
`;

const PresetLabel = styled.span`
  && {
    color: #1a4f5a;
    cursor: pointer;
  }
`;

export interface Props {
  readonly presets: ReadonlyArray<IPreset>;
  readonly onApplyPreset: (presetName: string) => void;
}

export default class extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <PresetList>
        {this.props.presets.map(preset => (
          <li key={preset.name} onClick={this.props.onApplyPreset.bind(null, preset.name)}>
            <Preset>
              <PresetLabel>{preset.name}</PresetLabel>
            </Preset>
          </li>
        ))}
      </PresetList>
    );
  }
}
