import { useState } from "react"
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  createTheme,
  CssBaseline,
  adaptV4Theme,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ThemeProvider as ThemeProviderNew, createTheme as createThemeNew } from "@mui/material"
import { SubstrateLight, SubstrateDark, SubstrateDarkNew, SubstrateLightNew } from "../themes"
import { useLocalStorage } from "../hooks"

import { Logo } from "."


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100vw",
    maxWidth: "1330px",
    padding: theme.spacing(2),
    paddingRight: theme.spacing(1),

    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(1),
    },
  },
}))

const ThemeToggleProvider = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles()
  const [localTheme, setLocalTheme] = useLocalStorage("theme")
  const [theme, setTheme] = useState(localTheme === "false" ? false : true)
  const appliedTheme = createTheme(adaptV4Theme(theme ? SubstrateLight : SubstrateDark))
  const appliedThemeNew = createThemeNew(theme ? SubstrateLightNew : SubstrateDarkNew )

  const selectTheme = (selected: boolean) => {
    setLocalTheme(selected.toString())
    setTheme(selected)
  }

  return (
    <StyledEngineProvider injectFirst>
      (<ThemeProvider theme={appliedTheme}>
        <ThemeProviderNew theme={appliedThemeNew}>
          <CssBaseline />
          <div className={classes.root}>
            <Logo theme={theme} onClick={() => selectTheme(!theme)} />
          </div>
          {children}
        </ThemeProviderNew>
      </ThemeProvider>)
    </StyledEngineProvider>
  );
}

export default ThemeToggleProvider
