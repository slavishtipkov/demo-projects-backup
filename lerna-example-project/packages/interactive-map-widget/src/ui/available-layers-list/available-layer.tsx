import { LayerId } from "@dtn/map-lib";
import * as React from "react";
import styled from "../../styled-components";
import Icon from "../icon";

export const Layer = styled.div`
  && {
    padding: 2px 0;
    font-size: 14px;
  }
`;

export const Label = styled.label`
  && {
    position: relative;
    display: flex;
    margin-bottom: 6px;
    color: #1a4f5a;
    cursor: pointer;
    padding-right: 20px;
  }
`;

export const DisplayLabel = styled.span`
  && {
    flex: 1;
  }
`;

export const AvailableLayerCheckbox = styled.div`
  && {
    margin-right: 8px;

    input[type="checkbox"] {
      position: absolute;
      left: 0;
      width: 16px;
      height: 16px;
      margin-right: 10px;
      opacity: 0;
    }
  }
`;

const LayerIcon = styled.div`
  && {
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export interface AvailableLayerProps {
  readonly layerId: LayerId;
  readonly displayLabel: string;
  readonly displayIcon: string;
  readonly isActive?: boolean;
  readonly onAddLayer: (layerId: LayerId) => void;
  readonly onRemoveLayer: (layerId: LayerId) => void;
}

export const AvailableLayer: React.SFC<AvailableLayerProps> = props => {
  let handleLayerToggle = () => {
    if (props.isActive) {
      props.onRemoveLayer(props.layerId);
    } else {
      props.onAddLayer(props.layerId);
    }
  };
  return (
    <Layer>
      <Label>
        <AvailableLayerCheckbox>
          <Icon icon={props.isActive ? "checkboxChecked" : "checkbox"} size={18} color="#1A4F5A" />
          <input
            type="checkbox"
            name={props.displayLabel}
            checked={props.isActive}
            onChange={handleLayerToggle}
          />
        </AvailableLayerCheckbox>
        <DisplayLabel>{props.displayLabel}</DisplayLabel>

        <LayerIcon>
          {props.displayIcon !== "loading" ? (
            <div dangerouslySetInnerHTML={{ __html: props.displayIcon }} />
          ) : (
            <Icon icon={"loading"} size={18} color="#1A4F5A" />
          )}
        </LayerIcon>
      </Label>
    </Layer>
  );
};
