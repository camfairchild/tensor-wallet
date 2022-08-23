import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AccountCard, BalanceValue } from ".";
import { BN } from "@polkadot/util";
import StakeForm from "./StakeForm";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React from "react";
const Accordion = styled((props) => (_jsx(MuiAccordion, { disableGutters: true, elevation: 0, square: true, ...props })))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));
const AccordionSummary = styled((props) => (_jsx(MuiAccordionSummary, { expandIcon: _jsx(ArrowForwardIosSharpIcon, { sx: { fontSize: '0.9rem' } }), ...props })))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(1),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
export default function StakeRow({ columns, unit, row, expanded, onChange, refreshStake }) {
    const setStake = (amount) => {
        row.stake = amount;
    };
    return (_jsxs(Accordion, { expanded: expanded === row['address'], onChange: onChange, children: [_jsx(AccordionSummary, { "aria-controls": "panel1d-content", id: "panel1d-header", children: _jsx(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", width: "100%", children: columns.map((column) => {
                        const value = row[column.id];
                        return (_jsxs(React.Fragment, { children: [column.id === "address" && (_jsx(AccountCard, { account: { address: value.toString(), name: "" }, addressFormat: "Full" })), column.id === "stake" && // This may look overwhelming but is just for "dump" data until page is fixed
                                    (typeof value === "number" || typeof value === "string") && (_jsx(BalanceValue, { isVisible: true, value: new BN(value), unit: unit, size: "large", style: { width: "100%", justifyContent: "flex-end" } }))] }));
                    }) }) }), _jsx(AccordionDetails, { children: _jsx(Box, { justifyContent: "flex-end", flexDirection: "row", alignItems: "flex-start", children: _jsx(StakeForm, { hotkeyAddr: row['address'], stake: row.stake, refreshStake: refreshStake }) }) })] }));
}
