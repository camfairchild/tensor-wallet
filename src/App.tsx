import { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { ApiContext, AccountContext } from "./utils/contexts"
import { ApiCtx, LocalStorageAccountCtx } from "./utils/types"
import { useApiCreate, useLocalStorage } from "./hooks"
import { createAccountFromInjected } from "./utils/utils"
import { NETWORKS } from "./utils/constants"
import Banner from "./components/Banner"

import {
  web3Accounts,
  web3AccountsSubscribe,
  web3Enable
} from '@polkadot/extension-dapp';

import Home from "./Home"

import {
  NavFooter,
  ThemeToggleProvider,
  Head,
  ErrorBoundary,
  BurnrBG,
  BurnrDivider,
} from "./components"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import Stack from "@mui/material/Stack"

interface Props {
  className?: string
}

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
}))

const App: React.FunctionComponent<Props> = ({ className = "" }: Props) => {
  
  const classes = useStyles()
  const [endpoint, setEndpoint] = useLocalStorage("endpoint")
  const apiCtx: ApiCtx = useApiCreate("0")
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])

  if (!endpoint) {
    setEndpoint(NETWORKS[parseInt(apiCtx.network)].id)
  }

  const [account, setCurrentAccount] = useState<LocalStorageAccountCtx>(
    {} as LocalStorageAccountCtx,
  )
  const [loader, setLoader] = useState(true)

  useEffect((): void => {
    const callSetters = async () => {
        if (await apiCtx.api.isReady) {
          const allInjected = await web3Enable('Tensor Wallet');
          const allAccounts = await web3Accounts();
          setAccounts(allAccounts);
          await web3AccountsSubscribe(accounts => {
            setAccounts(accounts)
          });
          if (!!!Object.keys(account).length && accounts.length > 0) {
            const userTmp = createAccountFromInjected(accounts)
            setCurrentAccount(userTmp)
            setLoader(false)
          } else if (allAccounts.length === 0) {
            // if there are no accounts, set the loader to false
            setLoader(false)
            setTimeout(() => {
              callSetters()
            }, 2000)
          }
        }
    }

    apiCtx.api && callSetters()
  }, [apiCtx?.api])

  useEffect((): void => {
    console.log(account, account?.accountAddress, accounts)
    if ((!!!account || !!!accounts.filter(act => act.address === account.accountAddress).length) && accounts.length > 0) {
      const userTmp = createAccountFromInjected(accounts)
      console.log('Changed account 1', userTmp)
      setCurrentAccount(userTmp)
      setLoader(false)
    }
  }, [accounts])

  return (
    <Stack spacing={0} direction="column">
      <Banner />
      <div className={`${classes.root} ${className}`}>
        <ThemeToggleProvider>
          <AccountContext.Provider value={{ account, setCurrentAccount }}>
            <ErrorBoundary>
              <main className={classes.main}>
                <ApiContext.Provider value={apiCtx}>
                  <Head />
                  <BurnrDivider />
                  <Home accounts={accounts} loader={loader} />
                  <BurnrBG />
                </ApiContext.Provider>
              </main>
              <NavFooter />
            </ErrorBoundary>
          </AccountContext.Provider>
        </ThemeToggleProvider>
      </div>
    </Stack>
  )
}

export default App
