import { ActiveLayerDescriptor, LayerDefinition, LayerId } from "@dtn/map-lib";
import { uniq } from "lodash-es";
import * as React from "react";
import { AvailableLayer } from "./available-layer";
import Category from "./category";
import { SubCategory } from "./sub-category";

export interface Props {
  readonly layers: ReadonlyArray<LayerDefinition>;
  readonly loadingLayers: ReadonlyArray<string>;
  readonly activeLayerDescriptors: ReadonlyArray<ActiveLayerDescriptor>;
  readonly onAddLayer: (layerId: LayerId) => void;
  readonly onRemoveLayer: (layerId: LayerId) => void;
}

export interface State {}

export default class AvailableLayersList extends React.Component<Props, State> {
  render(): JSX.Element {
    let categories = uniq(this.props.layers.map(l => l.category));
    let getSubcategorieForCategory = (category: string) =>
      uniq(this.props.layers.filter(l => l.category === category).map(l => l.subCategory));
    let getLayersForCategoryAndSubcategory = (category: string, subCategory: string) =>
      this.props.layers.filter(l => l.subCategory === subCategory && l.category === category);
    return (
      <ul>
        {categories.map(c => (
          <Category key={c} displayLabel={c}>
            {getSubcategorieForCategory(c).map(s => (
              <SubCategory key={s} displayLabel={s}>
                {getLayersForCategoryAndSubcategory(c, s).map(l => (
                  <AvailableLayer
                    key={l.id}
                    layerId={l.id}
                    isActive={Boolean(
                      this.props.activeLayerDescriptors.find(({ layerId }) => layerId === l.id),
                    )}
                    displayLabel={l.displayLabel}
                    displayIcon={this.props.loadingLayers.includes(l.id) ? "loading" : l.icon}
                    onAddLayer={this.props.onAddLayer}
                    onRemoveLayer={this.props.onRemoveLayer}
                  />
                ))}
              </SubCategory>
            ))}
          </Category>
        ))}
      </ul>
    );
  }
}
