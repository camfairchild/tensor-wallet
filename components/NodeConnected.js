import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography, Box } from "@material-ui/core";
import { NETWORKS, BURNR_WALLET } from "../utils/constants";
import { useApi } from "../hooks";
import { logger } from "@polkadot/util";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
const useStyles = makeStyles((theme) => createStyles({
    nodeSelectorWrap: {
        position: "relative",
        height: "60px",
        borderTopRightRadius: theme.spacing(0.5),
        borderTopLeftRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.background.paper,
    },
    nodeSelectorInner: {
        position: "absolute",
        zIndex: theme.zIndex.modal,
        width: "100%",
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.background.paper,
        "&.open": {
            boxShadow: theme.shadows[2],
        },
    },
    nodeDesc: {
        paddingLeft: theme.spacing(1),
    },
}));
export default function NodeConnected() {
    const l = logger(BURNR_WALLET);
    const classes = useStyles();
    const [fiberColor, setFiberColor] = useState("error");
    const { api, network } = useApi();
    useEffect(() => {
        const getColor = async (api) => {
            if (api && (await api.isReady)) {
                setFiberColor("primary");
                l.log("TensorWallet is now connected to", NETWORKS[parseInt(network)].name);
            }
        };
        api && getColor(api);
    }, [api, l]);
    return (_jsx("div", { className: classes.nodeSelectorWrap, children: _jsx("div", { className: classes.nodeSelectorInner, children: _jsxs(Box, { display: "flex", alignItems: "center", pt: 2.5, pb: 2.5, pl: 2.5, pr: 2.5, children: [_jsx(FiberManualRecordIcon, { style: { fontSize: "16px", marginRight: 4 }, color: fiberColor }), _jsxs(Box, { width: "100%", display: "flex", alignItems: "baseline", children: [_jsx(Typography, { variant: "h4", children: NETWORKS[parseInt(network)].name }), _jsx(Typography, { variant: "body2", className: classes.nodeDesc, color: "textSecondary", children: NETWORKS[parseInt(network)].client })] })] }) }) }));
}
