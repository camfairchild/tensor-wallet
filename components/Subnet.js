import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
export default function Subnet({ netuid, children }) {
    const [expanded, setExpanded] = React.useState(false);
    return (_jsxs(Accordion, { square: true, expanded: expanded, onChange: () => setExpanded(!expanded), children: [_jsx(AccordionSummary, { "aria-controls": `panel${netuid}d-content`, id: `panel${netuid}d-header`, children: _jsxs(Typography, { children: ["Subnet ", netuid] }) }), _jsx(AccordionDetails, { children: children })] }));
}
