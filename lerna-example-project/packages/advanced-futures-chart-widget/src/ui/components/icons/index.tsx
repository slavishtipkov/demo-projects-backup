import * as React from "react";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";

export interface Icons {
  readonly [key: string]: {
    readonly [key: string]: React.ReactNode;
  };
}

let icons: Icons = {
  common: {
    error: (
      <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5-103 385.5-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103zm128 1247v-190q0-14-9-23.5t-22-9.5h-192q-13 0-23 10t-10 23v190q0 13 10 23t23 10h192q13 0 22-9.5t9-23.5zm-2-344l18-621q0-12-10-18-10-8-24-8h-220q-14 0-24 8-10 6-10 18l17 621q0 10 10 17.5t24 7.5h185q14 0 23.5-7.5t10.5-17.5z" />
      </svg>
    ),
    downArrow: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
      </svg>
    ),
    rightArrow: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
        <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
      </svg>
    ),
  },
};

export interface IconProps {
  readonly wrapper?: string;
  readonly icon: string;
  readonly width: string;
  readonly height: string;
  readonly color: string;
  readonly className?: string;
}

const Icon: React.SFC<IconProps> = ({ icon, wrapper, className }) => (
  <i className={className} data-testid="icon">
    {wrapper ? icons[wrapper][icon] : icons[icon]}
  </i>
);
const StyledIcon = styled(Icon)`
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  > svg {
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    fill: ${({ color }) => color};
  }
`;

export default StyledIcon;
