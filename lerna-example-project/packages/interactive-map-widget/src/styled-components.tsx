import * as styledComponents from "styled-components";
import { StyledComponentClass, ThemedStyledComponentsModule } from "styled-components";
import { ThemeProp } from "./public/library";

const {
  default: styled,
  css,
  keyframes,
  ThemeProvider,
  withTheme,
  injectGlobal,
} = styledComponents as ThemedStyledComponentsModule<ThemeProp>;

export { css, keyframes, withTheme, ThemeProvider, ThemeProp, StyledComponentClass, injectGlobal };
export default styled;
