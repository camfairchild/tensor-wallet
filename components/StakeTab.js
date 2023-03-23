import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useContext } from "react";
import { makeStyles, alpha as fade } from "@material-ui/core";
import { AccountContext } from "../utils/contexts";
import { ErrorBoundary, StakeRow } from ".";
import { useBalance } from "../hooks";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import Subnet from "./Subnet";
import DelegateRow from "./DelegateRow";
const columns = [
    { id: "address", label: "Hotkey", width: 160 },
    { id: "stake", label: "Stake" },
];
const delegateInfoColumns = [
    { id: "delegate_ss58", label: "Delegate Hotkey", width: 160 },
    { id: "owner_ss58", label: "Owner Coldkey", width: 160 },
    { id: "nominators", label: "Nominators" },
    { id: "total_stake", label: "Total Stake" },
    { id: "take", label: "Take" },
    { id: "stake", label: "Stake" }
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
    no_neurons_error: {
        textAlign: "center",
        padding: theme.spacing(2),
    }
}));
export default function StakeTab({ stakeData, loader, refreshMeta, delegateInfo, delegatesExtras }) {
    const classes = useStyles();
    const { account } = useContext(AccountContext);
    const balanceArr = useBalance(account?.accountAddress || "");
    const unit = balanceArr[3];
    const handleChange = (panel) => {
        setExpanded(expanded === panel ? false : panel);
    };
    const [expanded, setExpanded] = React.useState(false);
    const [expandedDelegate, setExpandedDelegate] = React.useState(false);
    return (_jsx(Stack, { spacing: 2, direction: "column", divider: _jsx(Divider, { orientation: "vertical", flexItem: true }), children: loader ? (_jsx(Paper, { className: classes.loadingPaper, children: _jsxs(Stack, { spacing: 2, direction: "column", justifyContent: "center", children: [_jsx(Box, { children: _jsx(CircularProgress, { color: "primary" }) }), _jsx(Typography, { variant: "body2", children: "Syncing the Metagraph" })] }) })) :
            _jsxs(React.Fragment, { children: [_jsx(Stack, { direction: "row", justifyContent: "space-between", className: classes.table, children: columns.map((column) => (_jsx(Typography, { align: column.align, style: {
                                width: column.width,
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                            }, children: column.label }, column.id))) }), _jsxs(Box, { children: [_jsxs(ErrorBoundary, { children: [!!Object.keys(stakeData).length && Object.entries(stakeData).map(([netuid, neurons]) => {
                                        return _jsx(Stack, { spacing: 2, direction: "column", divider: _jsx(Divider, { orientation: "vertical", flexItem: true }), children: _jsx(Subnet, { netuid: netuid, children: neurons?.map((row, i) => {
                                                    return (_jsx(StakeRow, { refreshMeta: refreshMeta, expanded: expanded, onChange: () => handleChange(row['address']), unit: unit, row: row, columns: columns }, `row-${row.address}`));
                                                }) }) });
                                    }), !!!Object.keys(stakeData).length && _jsx(Typography, { variant: "body2", className: classes.no_neurons_error, children: "No Neurons Registered to this Coldkey" })] }), _jsxs(ErrorBoundary, { children: [!!delegateInfo.length &&
                                        _jsxs(React.Fragment, { children: [_jsx(Typography, { variant: "body2", sx: {
                                                        fontWeight: 'bold',
                                                    }, children: "Delegates" }), _jsx(Paper, { style: { maxHeight: 300, overflow: 'auto' }, children: _jsx(List, { children: delegateInfo.map((delegate) => {
                                                            return _jsx(DelegateRow, { coldkey_ss58: account.accountAddress, refreshMeta: refreshMeta, expanded: expanded, onChange: () => handleChange(delegate.delegate_ss58), unit: unit, delegate: delegate, columns: delegateInfoColumns, delegateExtra: delegatesExtras[delegate.delegate_ss58] }, `row-${delegate.delegate_ss58}`);
                                                        }) }) })] }), !!!delegateInfo.length && _jsx(Typography, { variant: "body2", className: classes.no_neurons_error, children: "No Delegates exist" })] })] })] }) }));
}
