import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import { NodeConnected } from ".";
const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down("sm")]: {
            paddingTop: theme.spacing(7),
        },
    },
}));
const Head = () => {
    const classes = useStyles();
    return (_jsxs(Grid, { container: true, alignItems: "center", className: classes.root, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(Box, { paddingX: 2, children: _jsx(Typography, { variant: "h1", children: "Tensor Wallet" }) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(NodeConnected, {}) })] }));
};
export default Head;
