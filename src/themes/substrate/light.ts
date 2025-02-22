import { DeprecatedThemeOptions } from "@mui/material/styles"
import { DeprecatedThemeOptions as DeprecatedThemeOptionsNew } from "@mui/material"
import colors from "./colors"
import typography, { typographyNew } from "./typography"
import shadows from "./shadows"
import { grey } from "@mui/material/colors"

const light: DeprecatedThemeOptions = {
  typography: typography.typography,
  shadows: shadows.shadows,
  palette: {
    mode: "light",
    common: {
      black: colors.black,
      white: colors.white,
    },
    background: {
      paper: colors.light.light,
      default: colors.light.dark,
    },
    primary: {
      light: colors.substrate.light,
      main: colors.substrate.dark,
      dark: colors.substrate.dark,
      contrastText: colors.black,
    },
    secondary: {
      light: "#89a7ce",
      main: colors.black,
      dark: "#534c5d",
      contrastText: colors.white,
    },
    error: {
      light: "rgba(247, 4, 7, 1)",
      main: "rgba(235, 4, 7, 1)",
      dark: "rgba(197, 5, 8, 1)",
      contrastText: colors.paper,
    },
    text: {
      primary: colors.black,
      secondary: colors.dark.main,
      disabled: colors.dark.light,
    },
    action: {
      active: colors.substrate.dark,
    },
    divider: grey[300],
  },
}

const { hint: textHint, ...restText }: any = light.palette?.text

export const SubstrateLightNew: DeprecatedThemeOptionsNew = {
  ...light,
  typography: typographyNew.typography,
  palette: {
    ...light.palette,
    mode: "light",
    text: restText,
  },
}

export default light
