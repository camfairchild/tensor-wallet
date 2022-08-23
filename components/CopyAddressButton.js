import { jsx as _jsx } from "react/jsx-runtime";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from "@mui/material/Button";
export default function CopyAddressButton({ accountAddress }) {
    const copyAddress = (address) => {
        const el = document.createElement('textarea');
        el.value = address;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
    return (_jsx(Button, { variant: "outlined", color: "primary", startIcon: _jsx(ContentCopyIcon, {}), onClick: () => copyAddress(accountAddress), children: accountAddress }));
}
