import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useContext } from "react";
import { makeStyles, alpha as fade, } from "@material-ui/core";
import { AccountContext } from "../utils/contexts";
import { StakeRow } from ".";
import { useBalance } from "../hooks";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
const columns = [
    { id: "address", label: "Hotkey", width: 160 },
    { id: "stake", label: "Stake" },
];
const useStyles = makeStyles((theme) => ({
    table: {
        "& th": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.disabled,
        },
        "& td, & th": {
            padding: theme.spacing(0.5),
            borderBottom: `1px solid ${fade(theme.palette.divider, 0.5)}`,
        },
        "& td:last-child, & th:last-child": {
            textAlign: "center",
        },
        "& tr:hover": {
            backgroundColor: "transparent !important",
            "& button": {
                backgroundColor: "rgba(0, 0, 0, 0.03)",
            },
        },
    },
    loadingPaper: {
        height: "calc(100vh - 150px)",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));
export default function StakeTab({ rows, loader, refreshStake }) {
    const classes = useStyles();
    const { account } = useContext(AccountContext);
    const balanceArr = useBalance(account?.accountAddress || "");
    const unit = balanceArr[3];
    const handleChange = (panel) => {
        setExpanded(expanded === panel ? false : panel);
    };
    const [expanded, setExpanded] = React.useState(false);
    return (_jsx(Stack, { spacing: 2, direction: "column", divider: _jsx(Divider, { orientation: "vertical", flexItem: true }), children: loader ? (_jsx(Paper, { className: classes.loadingPaper, children: _jsx(CircularProgress, { color: "primary" }) })) :
            _jsxs(React.Fragment, { children: [_jsx(Stack, { direction: "row", justifyContent: "space-between", className: classes.table, children: columns.map((column) => (_jsx(Typography, { align: column.align, style: {
                                width: column.width,
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                            }, children: column.label }, column.id))) }), _jsx(Box, { children: rows?.map((row, i) => {
                            return (_jsx(StakeRow, { refreshStake: refreshStake, expanded: expanded, onChange: () => handleChange(row['address']), unit: unit, row: row, columns: columns }, `row-${row.address}`));
                        }) })] }) }));
}
