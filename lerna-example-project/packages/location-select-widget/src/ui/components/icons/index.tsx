import * as React from "react";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";

export interface Icons {
  readonly [key: string]: {
    readonly [key: string]: React.ReactNode;
  };
}

// TODO: Add all svg-s here when naming issues are cleared
let icons: Icons = {
  common: {
    error: (
      <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5-103 385.5-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103zm128 1247v-190q0-14-9-23.5t-22-9.5h-192q-13 0-23 10t-10 23v190q0 13 10 23t23 10h192q13 0 22-9.5t9-23.5zm-2-344l18-621q0-12-10-18-10-8-24-8h-220q-14 0-24 8-10 6-10 18l17 621q0 10 10 17.5t24 7.5h185q14 0 23.5-7.5t10.5-17.5z" />
      </svg>
    ),
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.018 25">
        <g id="DTN-logo-color" transform="translate(0 -0.309)">
          <path
            id="Path_818"
            data-name="Path 818"
            fill="#e07c00"
            d="M4.17,82.168A9.272,9.272,0,0,1,4.518,80.9H1.471a12.663,12.663,0,0,0-.261,1.268Z"
            transform="translate(-1.071 -71.25)"
          />
          <path
            id="Path_819"
            data-name="Path 819"
            fill="#e07c00"
            d="M2.923,103.951c0-.178.017-.348.028-.531H.022c0,.176-.012.348-.012.531,0,.248.008.494.022.738H2.96C2.942,104.443,2.923,104.2,2.923,103.951Z"
            transform="translate(-0.01 -91.16)"
          />
          <path
            id="Path_820"
            data-name="Path 820"
            fill="#e07c00"
            d="M7.19,59.595h3.2A9.736,9.736,0,0,1,11.2,58.32H7.764a12.539,12.539,0,0,0-.574,1.275Z"
            transform="translate(-6.358 -51.287)"
          />
          <path
            id="Path_821"
            data-name="Path 821"
            fill="#e07c00"
            d="M11.13,148.46H7.9a12.2,12.2,0,0,0,.6,1.269h3.49a9.66,9.66,0,0,1-.857-1.269Z"
            transform="translate(-6.986 -130.98)"
          />
          <path
            id="Path_822"
            data-name="Path 822"
            fill="#e07c00"
            d="M4.874,127.209a9.729,9.729,0,0,1-.384-1.269H1.52a11.839,11.839,0,0,0,.287,1.269Z"
            transform="translate(-1.345 -111.07)"
          />
          <path
            id="Path_823"
            data-name="Path 823"
            fill="#00ae42"
            d="M22.945,5.7A9.589,9.589,0,0,1,36.913,18.749h3.492A12.517,12.517,0,0,0,19.09,5.7Z"
            transform="translate(-16.879 0)"
          />
          <path
            id="Path_824"
            data-name="Path 824"
            fill="#00ae42"
            d="M36.742,171a9.561,9.561,0,0,1-12.447,0H20.36a12.5,12.5,0,0,0,20.318,0Z"
            transform="translate(-18.001 -150.907)"
          />
          <path
            id="Path_825"
            data-name="Path 825"
            fill="#0082ca"
            d="M42.139,68.48h1.383v7.65H42.139v-.58a2.7,2.7,0,0,1-.811.554,2.288,2.288,0,0,1-.889.17,2.47,2.47,0,0,1-1.854-.831,2.891,2.891,0,0,1-.784-2.065,2.973,2.973,0,0,1,.759-2.1,2.415,2.415,0,0,1,1.842-.818,2.36,2.36,0,0,1,.935.185,2.568,2.568,0,0,1,.811.556Zm-1.463,3.245a1.4,1.4,0,0,0-1.071.464,1.655,1.655,0,0,0-.427,1.173,1.672,1.672,0,0,0,.433,1.187,1.4,1.4,0,0,0,1.07.464,1.434,1.434,0,0,0,1.081-.453,1.693,1.693,0,0,0,.431-1.2,1.638,1.638,0,0,0-.431-1.178,1.451,1.451,0,0,0-1.087-.45Z"
            transform="translate(-33.419 -60.27)"
          />
          <path
            id="Path_826"
            data-name="Path 826"
            fill="#0082ca"
            d="M95.347,69.32h1.383v2.033h1.1v1.191h-1.1v4.332H95.347V72.544H94.22V71.353h1.127Z"
            transform="translate(-83.301 -61.012)"
          />
          <path
            id="Path_827"
            data-name="Path 827"
            fill="#0082ca"
            d="M132.39,85.8h1.384v.563a3.361,3.361,0,0,1,.853-.547,2.062,2.062,0,0,1,.783-.155,1.9,1.9,0,0,1,1.391.574,1.973,1.973,0,0,1,.481,1.441v3.653H135.9V88.9a6.094,6.094,0,0,0-.089-1.315.913.913,0,0,0-.307-.5.856.856,0,0,0-.542-.17,1,1,0,0,0-.715.286,1.507,1.507,0,0,0-.417.779,6.5,6.5,0,0,0-.059,1.123v2.22H132.39Z"
            transform="translate(-117.047 -75.457)"
          />
          <path
            id="Path_828"
            data-name="Path 828"
            fill="#00ae42"
            d="M202.918,174.626c-.012-.087-.046-.132-.1-.141h0a.145.145,0,0,0,.116-.14.139.139,0,0,0-.052-.116.308.308,0,0,0-.181-.044,1.023,1.023,0,0,0-.163.014v.579h.093v-.248h.065a.108.108,0,0,1,.127.1.409.409,0,0,0,.038.147h.1A.43.43,0,0,1,202.918,174.626Zm-.223-.177h-.065v-.2a.443.443,0,0,1,.065,0c.105,0,.141.051.141.1,0,.067-.064.1-.141.1Z"
            transform="translate(-179.066 -153.722)"
          />
        </g>
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
