import * as React from "react";
import styled, { css } from "../../../styled-components";
import Icon from "../icons";

export interface ImageProps {
  readonly isMobile?: boolean;
}

const Image = styled<ImageProps, "div">("div")`
  flex: 1;
  max-width: 30%;
  overflow: hidden;
  ${({ isMobile }) =>
    isMobile &&
    css`
      align-self: center;
      max-width: 100%;
    `};
`;

export interface Props {
  readonly iconWrapper: string;
  readonly weatherCode: number;
  readonly width: string;
  readonly height: string;
  readonly isMobileView?: boolean;
}

const ImageContainer = (props: Props) => {
  return (
    <Image isMobile={props.isMobileView} className="weatherIcon">
      <Icon
        wrapper={props.iconWrapper}
        icon={`${props.weatherCode}`}
        color="currentColor"
        width={props.width}
        height={props.height}
      />
    </Image>
  );
};

export default ImageContainer;
