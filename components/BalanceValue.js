import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import { prettyBalance } from "../utils/utils";
// @TODO get token codes from api
const useStyles = makeStyles((theme) => ({
    root: {
        display: "inline-flex",
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        borderRadius: theme.spacing(0.5),
        backgroundColor: (props) => props.colored ? theme.palette.primary.light : "",
        color: (props) => props.colored
            ? theme.palette.getContrastText(theme.palette.primary.light)
            : theme.palette.text.primary,
    },
    blur: {
        filter: (props) => (props.visible ? "unset" : "blur(5px)"),
    },
}));
const BalanceValue = ({ value, isVisible, unit = "TAO", size, style, }) => {
    const fBalance = prettyBalance(value);
    const isColored = parseInt(fBalance) >= 0;
    const classes = useStyles({ colored: isColored, visible: isVisible });
    const TypographyVariant = size === "large" ? "subtitle1" : "subtitle2";
    return (_jsx(Box, { component: "span", className: classes.root, style: style, children: _jsx(Typography, { variant: TypographyVariant, className: classes.blur, children: `${fBalance} ${unit}` }) }));
};
export default memo(BalanceValue);
