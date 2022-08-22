import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, makeStyles, } from "@material-ui/core";
import { SubstrateLight, SubstrateDark } from "../themes";
import { useLocalStorage } from "../hooks";
import { Logo } from ".";
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
        [theme.breakpoints.down("sm")]: {
            paddingTop: theme.spacing(1),
        },
    },
}));
const ThemeToggleProvider = ({ children }) => {
    const classes = useStyles();
    const [localTheme, setLocalTheme] = useLocalStorage("theme");
    const [theme, setTheme] = useState(localTheme === "false" ? false : true);
    const appliedTheme = createTheme(theme ? SubstrateLight : SubstrateDark);
    const selectTheme = (selected) => {
        setLocalTheme(selected.toString());
        setTheme(selected);
    };
    return (_jsxs(ThemeProvider, { theme: appliedTheme, children: [_jsx(CssBaseline, {}), _jsx("div", { className: classes.root, children: _jsx(Logo, { theme: theme }) }), children] }));
};
export default ThemeToggleProvider;
