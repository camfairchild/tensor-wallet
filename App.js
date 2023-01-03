import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ApiContext, AccountContext } from "./utils/contexts";
import { useApiCreate, useLocalStorage } from "./hooks";
import { createAccountFromInjected } from "./utils/utils";
import { NETWORKS } from "./utils/constants";
import Banner from "./components/Banner";
import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import Home from "./Home";
import { NavFooter, ThemeToggleProvider, Head, ErrorBoundary, BurnrBG, BurnrDivider, } from "./components";
import Stack from "@mui/material/Stack";
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
    },
    main: {
        width: "100%",
        maxWidth: `${theme.spacing(3) + 650}px`,
        padding: theme.spacing(2),
        flex: 1,
    },
}));
const App = ({ className = "" }) => {
    const classes = useStyles();
    const [endpoint, setEndpoint] = useLocalStorage("endpoint");
    const apiCtx = useApiCreate("0");
    const [accounts, setAccounts] = useState([]);
    if (!endpoint) {
        setEndpoint(NETWORKS[parseInt(apiCtx.network)].id);
    }
    const [account, setCurrentAccount] = useState({});
    const [loader, setLoader] = useState(true);
    function uniqueAddresses(account, i, accounts_) {
        // filters out duplicate addresses
        return accounts_.findIndex((acc) => acc.address === account.address) === i;
    }
    useEffect(() => {
        const callSetters = async () => {
            if (await apiCtx.api.isReady) {
                const allInjected = await web3Enable('Tensor Wallet');
                const allAccounts = await web3Accounts();
                setAccounts(allAccounts.filter(uniqueAddresses));
                await web3AccountsSubscribe(accounts => {
                    setAccounts(accounts.filter(uniqueAddresses));
                });
                if (allAccounts.length === 0) {
                    // if there are no accounts, set the loader to false
                    setLoader(false);
                    setTimeout(() => {
                        callSetters();
                    }, 2000);
                }
            }
        };
        apiCtx.api && callSetters();
    }, [apiCtx?.api]);
    useEffect(() => {
        if ((!!!account || !accounts.some(act => act.address === account.accountAddress)) && accounts.length > 0) {
            const userTmp = createAccountFromInjected(accounts);
            setCurrentAccount(userTmp);
            setLoader(false);
        }
    }, [accounts]);
    return (_jsxs(Stack, { spacing: 0, direction: "column", children: [_jsx(Banner, {}), _jsx("div", { className: `${classes.root} ${className}`, children: _jsx(ThemeToggleProvider, { children: _jsx(AccountContext.Provider, { value: { account, setCurrentAccount }, children: _jsxs(ErrorBoundary, { children: [_jsx("main", { className: classes.main, children: _jsxs(ApiContext.Provider, { value: apiCtx, children: [_jsx(Head, {}), _jsx(BurnrDivider, {}), _jsx(Home, { accounts: accounts, loader: loader }), _jsx(BurnrBG, {})] }) }), _jsx(NavFooter, {})] }) }) }) })] }));
};
export default App;
