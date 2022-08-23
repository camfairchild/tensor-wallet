import { jsx as _jsx } from "react/jsx-runtime";
import Divider from "@mui/material/Divider";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
const useStyles = makeStyles((theme) => createStyles({
    root: {
        position: "fixed",
        width: 600,
        height: 600,
        top: 45,
        bottom: 0,
        left: 0,
        right: 0,
        margin: "auto",
        background: theme.palette.secondary.dark,
        borderRadius: "50%",
        zIndex: -1,
        filter: "blur(80px)",
    },
}));
export const BurnrBG = () => {
    const classes = useStyles();
    return _jsx("div", { className: classes.root });
};
export const BurnrDivider = () => (_jsx(Divider, { style: { backgroundColor: "transparent", height: 0.5 } }));
