import { jsx as _jsx } from "react/jsx-runtime";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from "@mui/material/Button";
import { copyToClipboard } from "../utils/utils";
export default function CopyAddressButton({ accountAddress }) {
    return (_jsx(Button, { variant: "outlined", color: "primary", startIcon: _jsx(ContentCopyIcon, {}), onClick: () => copyToClipboard(accountAddress), sx: {
            textTransform: "none",
        }, children: accountAddress }));
}
