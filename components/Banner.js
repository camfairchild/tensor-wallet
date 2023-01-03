import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
export default function Banner() {
    const [open, setOpen] = useState(true);
    return (_jsx(Modal, { keepMounted: true, open: open, "aria-labelledby": "modal-modal-title", "aria-describedby": "modal-modal-description", children: _jsx(Alert, { severity: "info", sx: { mb: 2 }, children: _jsxs(Stack, { direction: "column", spacing: 1, children: [_jsxs(Box, { children: [_jsx(AlertTitle, { children: "Legal Disclaimer" }), "This website is not affiliated with the Opentensor Foundation and is accepted \u201Cas is\u201D with no representation or warranty of any kind.", _jsx("br", {}), "By using this website and all the services it provides, the consumer acknowledges that the \u201Cauthors\u201D of this software, shall ", _jsx("strong", { children: "NOT" }), " be held liable for any loss of funds.", _jsx("br", {}), "The authors have no obligation to indemnify, defend, or hold harmess consumer, including without limitation against claims related to liability or infringement of intellectual property rights.", _jsx("br", {}), "This website is ", _jsx("strong", { children: "NOT" }), " audited and the consumer accepts wholly the responsibilities associated with any risks incurred.", _jsx("br", {})] }), _jsx(Button, { "aria-label": "accept terms", color: "inherit", size: "small", variant: 'outlined', onClick: () => {
                            setOpen(false);
                        }, startIcon: _jsx(CheckIcon, { fontSize: 'inherit' }), children: "I Have Read the Disclaimer and Accept" })] }) }) }));
}
