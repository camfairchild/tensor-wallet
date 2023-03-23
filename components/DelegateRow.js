import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AccountCard, BalanceValue, ErrorBoundary } from ".";
import { BN } from "@polkadot/util";
import StakeForm from "./StakeForm";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import { createUseStyles } from 'react-jss';
import '../assets/styles/DelegateRow.css';
const useStyles = createUseStyles(({
    stake_display: {
        fontWeight: "bold",
        width: "fill-available"
    }
}));
export default function DelegateRow({ columns, unit, delegate, expanded, onChange, refreshMeta, coldkey_ss58, delegateExtra }) {
    const [delegate_row, setDelegateRow] = React.useState({});
    const classes = useStyles();
    useEffect(() => {
        let _row = {
            stake: 0,
            take: delegate.take,
            owner_ss58: delegate.owner_ss58,
            delegate_ss58: delegate.delegate_ss58,
            total_stake: delegate.total_stake,
            nominators: delegate.nominators.length
        };
        delegate.nominators.filter(([nom, staked]) => {
            if (nom === coldkey_ss58) {
                _row = {
                    ..._row,
                    stake: staked
                };
            }
        });
        setDelegateRow({
            ...delegate_row,
            ..._row
        });
    }, [delegate]);
    return (_jsx(React.Fragment, { children: _jsx(ErrorBoundary, { children: !!Object.keys(delegate_row).length && (_jsxs(Accordion, { expanded: expanded === delegate_row.delegate_ss58, onChange: onChange, id: "delegates", children: [_jsx(AccordionSummary, { "aria-controls": "panel1d-content", id: "panel1d-header", children: _jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", width: "100%", children: [columns.map((column) => {
                                    if (!["delegate_ss58"].includes(column.id)) {
                                        return null;
                                    }
                                    const value = delegate_row[column.id];
                                    return (_jsx(React.Fragment, { children: column.id === "delegate_ss58" && (_jsx(AccountCard, { account: { address: value.toString(), name: delegateExtra?.name || "" }, addressFormat: "Compact" })) }, column.id));
                                }), _jsxs(Stack, { direction: "column", width: "18em", children: [columns.map((column) => {
                                            if (!["total_stake"].includes(column.id)) {
                                                return null;
                                            }
                                            const value = delegate_row[column.id];
                                            return (_jsx(React.Fragment, { children: _jsxs(Stack, { direction: "row", alignItems: "center", children: [_jsx(Typography, { className: classes.stake_display, children: "Total Stake:" }), _jsx(BalanceValue, { isVisible: true, value: new BN(value), unit: unit, size: "small", style: { width: "100%", justifyContent: "flex-end" } })] }) }, column.id));
                                        }), columns.map((column) => {
                                            if (!["stake"].includes(column.id)) {
                                                return null;
                                            }
                                            const value = delegate_row[column.id];
                                            return (_jsx(React.Fragment, { children: _jsxs(Stack, { direction: "row", alignItems: "center", children: [_jsx(Typography, { className: classes.stake_display, children: "Your Stake:" }), _jsx(BalanceValue, { isVisible: true, value: new BN(value), unit: unit, size: "small", style: { width: "100%", justifyContent: "flex-end" } })] }) }, column.id));
                                        })] })] }) }), _jsxs(AccordionDetails, { children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", width: "100%", children: [columns.map((column) => {
                                        if (!["owner_ss58"].includes(column.id)) {
                                            return null;
                                        }
                                        const value = delegate_row[column.id];
                                        return (_jsx(React.Fragment, { children: column.id === "owner_ss58" && (_jsx(Box, { flex: 3, children: _jsx(AccountCard, { account: { address: value.toString(), name: "Delegate Owner" }, addressFormat: "Short" }) })) }, column.id));
                                    }), _jsx(Stack, { direction: "column", justifyContent: "space-between", alignItems: "center", width: "100%", flex: 2, children: columns.map((column) => {
                                            if (!["stake", "nominators"].includes(column.id)) {
                                                return null;
                                            }
                                            const value = delegate_row[column.id];
                                            return (_jsxs(React.Fragment, { children: [["nominators"].includes(column.id) &&
                                                        (typeof value === "number") && (_jsx(React.Fragment, { children: _jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", width: "100%", children: [_jsxs(Typography, { style: {
                                                                        fontWeight: "bold",
                                                                    }, children: [column.id, ":"] }), _jsx(Typography, { children: value.toString() })] }) })), ["stake"].includes(column.id) &&
                                                        (typeof value === "number") && (_jsx(React.Fragment, { children: _jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", width: "100%", children: [_jsxs(Typography, { style: {
                                                                        fontWeight: "bold",
                                                                    }, children: ["your ", column.id, ":"] }), _jsx(BalanceValue, { isVisible: true, value: new BN(value), unit: unit, size: "small", style: { width: "100%", justifyContent: "flex-end" } })] }) }))] }, column.id));
                                        }) })] }), _jsx(Box, { justifyContent: "flex-end", flexDirection: "row", alignItems: "center", children: _jsx(ErrorBoundary, { children: _jsx(StakeForm, { hotkeyAddr: delegate_row.delegate_ss58, stake: delegate_row.stake, refreshMeta: refreshMeta }) }) })] })] })) }) }));
}
