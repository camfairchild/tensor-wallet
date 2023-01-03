import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import Identicon from "@polkadot/react-identicon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from "@material-ui/core/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import { copyToClipboard } from "../utils/utils";
const Alert = (props) => {
    return _jsx(MuiAlert, { elevation: 6, variant: "filled", ...props });
};
const AccountCard = ({ account, addressFormat, }) => {
    const [showCopied, setShowCopied] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx(Snackbar, { anchorOrigin: { vertical: "top", horizontal: "center" }, open: showCopied, autoHideDuration: 2000, onClose: () => setShowCopied(false), children: _jsx(Alert, { severity: "success", children: "Copied!" }) }), _jsxs(Stack, { spacing: 1, direction: addressFormat === "Full" ? "column" : "row", children: [_jsx(Identicon, { size: 32, theme: "polkadot", value: account.address, onCopy: () => {
                            setShowCopied(true);
                            copyToClipboard(account.address);
                        } }), _jsxs(Box, { height: 32, display: "flex", flexDirection: "column", justifyContent: "center", ml: 1, children: [account.name !== "" && (_jsx(Typography, { variant: "h6", children: account.name })), _jsx(Typography, { variant: "caption", sx: addressFormat === "Full" ? {} : {
                                    textOverflow: "ellipsis",
                                    overflowX: "clip",
                                    width: "5em",
                                }, children: account.address })] })] })] }));
};
export default AccountCard;
