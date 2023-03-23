import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AccountCard, BalanceValue, ErrorBoundary } from ".";
import { BN } from "@polkadot/util";
import StakeForm from "./StakeForm";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
export default function StakeRow({ columns, unit, row, expanded, onChange, refreshMeta }) {
    return (_jsxs(Accordion, { expanded: expanded === row['address'], onChange: onChange, children: [_jsx(AccordionSummary, { "aria-controls": "panel1d-content", id: "panel1d-header", children: _jsx(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", width: "100%", children: columns.map((column) => {
                        const value = row[column.id];
                        return (_jsxs(React.Fragment, { children: [column.id === "address" && (_jsx(AccountCard, { account: { address: value.toString(), name: "" }, addressFormat: "Full" })), column.id === "stake" && // This may look overwhelming but is just for "dump" data until page is fixed
                                    (typeof value === "number" || typeof value === "string") && (_jsx(BalanceValue, { isVisible: true, value: new BN(value), unit: unit, size: "large", style: { width: "100%", justifyContent: "flex-end" } }))] }, column.id));
                    }) }) }), _jsx(AccordionDetails, { children: _jsx(Box, { justifyContent: "flex-end", flexDirection: "row", alignItems: "flex-start", children: _jsx(ErrorBoundary, { children: _jsx(StakeForm, { hotkeyAddr: row['address'], stake: row.stake, refreshMeta: refreshMeta }) }) }) })] }));
}
