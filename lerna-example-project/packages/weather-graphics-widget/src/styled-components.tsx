import * as React from "react";
import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule, StyledComponentClass } from "styled-components";

import { ThemeProp } from "./public/library";

const { default: styled, css, keyframes, ThemeProvider, withTheme } = styledComponents;

export { css, keyframes, withTheme, ThemeProvider, ThemeProp, StyledComponentClass };
export default styled;
