import { createContext } from "react"
import {
  LocalStorageAccountCtx,
  AdminCtx,
  BalanceVisibilityCtx,
  EvtMgrCtx,
  EvtTxCtx,
  CreateAccountCtx,
  ApiCtx
} from "./types"

const BalanceVisibleContext = createContext<BalanceVisibilityCtx>({
  balanceVisibility: true,
  setBalanceVisibility: () => console.debug(),
})
const AccountContext = createContext<CreateAccountCtx>({
  account: {} as LocalStorageAccountCtx,
  setCurrentAccount: (t: LocalStorageAccountCtx) => console.debug(t),
})
const AdminContext = createContext<AdminCtx>({} as AdminCtx)
const ApiContext = createContext<ApiCtx>({} as ApiCtx)
const EvtMgrContext = createContext<EvtMgrCtx>([])
const EvtTxContext = createContext<EvtTxCtx>([])

export {
  AccountContext,
  AdminContext,
  ApiContext,
  BalanceVisibleContext,
  EvtMgrContext,
  EvtTxContext,
}
