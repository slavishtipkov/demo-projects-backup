import * as React from "react";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";

interface Icons {
  readonly [key: string]: React.ReactNode;
}

let icons: Icons = {
  geolocation: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.763 20.763">
      <g id="Group_32" data-name="Group 32" transform="translate(-319.515 -3.5)">
        <g id="Group_146" data-name="Group 146" transform="translate(298)">
          <path
            id="Union_21"
            data-name="Union 21"
            d="M-1108.668-20.236a1,1,0,0,1-1-1v-2.235a1.013,1.013,0,0,1,.006-.111,6.681,6.681,0,0,1-1.666-.694,6.828,6.828,0,0,1-2.5-2.5,6.687,6.687,0,0,1-.672-1.583l-.055,0h-2.235a1,1,0,0,1-1-1v-1.529a1,1,0,0,1,1-1h2.24a6.663,6.663,0,0,1,.722-1.774,6.835,6.835,0,0,1,2.5-2.5,6.672,6.672,0,0,1,1.66-.692V-39a1,1,0,0,1,1-1h1.529a1,1,0,0,1,1,1v2.146a6.668,6.668,0,0,1,1.7.7,6.836,6.836,0,0,1,2.5,2.5,6.671,6.671,0,0,1,.722,1.774h2.2a1,1,0,0,1,1,1v1.529a1,1,0,0,1-1,1h-2.254a6.694,6.694,0,0,1-.672,1.582,6.829,6.829,0,0,1-2.5,2.5,6.675,6.675,0,0,1-1.7.7c0,.034.005.068.005.1v2.235a1,1,0,0,1-1,1Zm-1.655-14.183a4.853,4.853,0,0,0-1.768,1.768,4.748,4.748,0,0,0-.652,2.438,4.747,4.747,0,0,0,.652,2.437,4.846,4.846,0,0,0,1.768,1.768,4.748,4.748,0,0,0,2.438.652,4.747,4.747,0,0,0,2.437-.652,4.84,4.84,0,0,0,1.768-1.768,4.747,4.747,0,0,0,.652-2.437,4.748,4.748,0,0,0-.652-2.438,4.846,4.846,0,0,0-1.768-1.768,4.747,4.747,0,0,0-2.437-.652A4.748,4.748,0,0,0-1110.323-34.42Zm.822,5.821a2.2,2.2,0,0,1-.67-1.616,2.2,2.2,0,0,1,.67-1.616,2.2,2.2,0,0,1,1.616-.67,2.2,2.2,0,0,1,1.615.67,2.2,2.2,0,0,1,.67,1.616,2.2,2.2,0,0,1-.67,1.616,2.2,2.2,0,0,1-1.615.67A2.2,2.2,0,0,1-1109.5-28.6Z"
            transform="translate(1139.8 44)"
          />
        </g>
      </g>
    </svg>
  ),
  location: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
      <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5-103 385.5-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103zm128 1247v-190q0-14-9-23.5t-22-9.5h-192q-13 0-23 10t-10 23v190q0 13 10 23t23 10h192q13 0 22-9.5t9-23.5zm-2-344l18-621q0-12-10-18-10-8-24-8h-220q-14 0-24 8-10 6-10 18l17 621q0 10 10 17.5t24 7.5h185q14 0 23.5-7.5t10.5-17.5z" />
    </svg>
  ),
};

export interface IconProps {
  readonly icon: string;
  readonly size: number;
  readonly color: string;
  readonly className?: string;
}

const Icon: React.SFC<IconProps> = ({ icon, className }) => (
  <i className={className} data-testid="icon">
    {icons[icon]}
  </i>
);
const StyledIcon = styled(Icon)`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};

  > svg {
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
    fill: ${({ color }) => color};
  }
`;

export default StyledIcon;
