import { createContext } from "react";
const BalanceVisibleContext = createContext({
    balanceVisibility: true,
    setBalanceVisibility: () => console.log(),
});
const AccountContext = createContext({
    account: {},
    setCurrentAccount: (t) => console.log(t),
});
const AdminContext = createContext({});
const ApiContext = createContext({});
const EvtMgrContext = createContext([]);
const EvtTxContext = createContext([]);
export { AccountContext, AdminContext, ApiContext, BalanceVisibleContext, EvtMgrContext, EvtTxContext, };
