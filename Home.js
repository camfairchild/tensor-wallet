import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { NavTabs, AccountCard, BalanceValue, BurnrDivider, AccountMenu, } from "./components";
import { AccountContext, BalanceVisibleContext } from "./utils/contexts";
import { validateLocalstorage } from "./utils/utils";
import { useBalance, useLocalStorage } from "./hooks";
const useStyles = makeStyles((theme) => ({
    paperAccount: {
        borderTopLeftRadius: theme.spacing(0.5),
    },
    loadingPaper: {
        height: "calc(100vh - 150px)",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));
;
const Home = ({ loader, accounts }) => {
    const [localBalance, setLocalBalance] = useLocalStorage("balanceVisibility");
    const [balanceVisibility, setBalanceVisibility] = useState(localBalance !== "false");
    const { account } = useContext(AccountContext);
    const classes = useStyles();
    const balanceArr = useBalance(account?.accountAddress || "");
    useEffect(() => {
        validateLocalstorage();
    }, []);
    useEffect(() => {
        setLocalBalance(balanceVisibility ? "true" : "false");
    }, [balanceVisibility, setLocalBalance]);
    return loader ? (_jsx(Paper, { className: classes.loadingPaper, children: _jsx(CircularProgress, {}) })) : (_jsxs(BalanceVisibleContext.Provider, { value: { balanceVisibility, setBalanceVisibility }, children: [_jsx(Paper, { square: true, className: classes.paperAccount, children: _jsxs(Box, { paddingY: 1, paddingX: 2, display: "flex", alignItems: "center", children: [_jsx(Box, { width: "50%", display: "flex", children: account?.accountAddress && (_jsxs(_Fragment, { children: [_jsx(AccountCard, { account: {
                                            address: account?.accountAddress,
                                            name: account?.accountName,
                                        } }), _jsx(AccountMenu, { accounts: accounts })] })) }), _jsxs(Box, { width: "50%", display: "flex", alignItems: "center", children: [_jsx(BalanceValue, { isVisible: balanceVisibility, unit: balanceArr[3], value: balanceArr[1], size: "large", style: { width: "100%", justifyContent: "flex-end" } }), _jsx(IconButton, { style: { borderRadius: 4 }, onClick: () => setBalanceVisibility(!balanceVisibility), children: balanceVisibility ? _jsx(VisibilityIcon, {}) : _jsx(VisibilityOffIcon, {}) })] })] }) }), _jsx(BurnrDivider, {}), _jsx(NavTabs, {})] }));
};
export default Home;
