import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from "react";
import Stack from "@mui/material/Stack";
import QRCode from "qrcode.react";
import { AccountContext } from "../utils/contexts";
import CopyAddressButton from "./CopyAddressButton";
const ReceiveFundsForm = () => {
    const { account } = useContext(AccountContext);
    return (_jsxs(Stack, { direction: "column", width: 600, justifyContent: "center", children: [_jsx(QRCode, { value: account.accountAddress, includeMargin: true, size: 400, style: { "justifySelf": "center" } }), _jsx(CopyAddressButton, { accountAddress: account.accountAddress })] }));
};
export default ReceiveFundsForm;
