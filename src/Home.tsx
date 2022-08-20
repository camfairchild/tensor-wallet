import { useState, useEffect, FunctionComponent, useContext } from "react"
import {
  Paper,
  IconButton,
  Box,
  makeStyles,
  CircularProgress,
} from "@material-ui/core"
import VisibilityIcon from "@material-ui/icons/Visibility"
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"
import {
  NavTabs,
  AccountCard,
  BalanceValue,
  BurnrDivider,
  AccountMenu,
} from "./components"

import { AccountContext, BalanceVisibleContext } from "./utils/contexts"
import { validateLocalstorage } from "./utils/utils"
import { useBalance, useLocalStorage } from "./hooks"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"

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
}))

interface Props {
  loader?: boolean,
  accounts: InjectedAccountWithMeta[]
}

;
const Home: FunctionComponent<Props> = ({ loader, accounts }: Props) => {
  const [localBalance, setLocalBalance] = useLocalStorage("balanceVisibility")
  const [balanceVisibility, setBalanceVisibility] = useState<boolean>(
    localBalance !== "false",
  )

  const { account } = useContext(AccountContext)
  const classes = useStyles()
  const balanceArr = useBalance(account?.accountAddress || "")

  useEffect((): void => {
    validateLocalstorage()
  }, [])

  useEffect((): void => {
    setLocalBalance(balanceVisibility ? "true" : "false")
  }, [balanceVisibility, setLocalBalance])

  return loader ? (
    <Paper className={classes.loadingPaper}>
      <CircularProgress />
    </Paper>
  ) : (
    <BalanceVisibleContext.Provider
      value={{ balanceVisibility, setBalanceVisibility }}
    >
      <Paper square className={classes.paperAccount}>
        <Box paddingY={1} paddingX={2} display="flex" alignItems="center">
          <Box width="50%" display="flex">
            {account?.accountAddress && (
              <>
                <AccountCard
                  account={{
                    address: account?.accountAddress,
                    name: account?.accountName,
                  }}
                />
                <AccountMenu accounts={accounts}/>
              </>
            )}
          </Box>
          <Box width="50%" display="flex" alignItems="center">
            <BalanceValue
              isVisible={balanceVisibility}
              unit={balanceArr[3]}
              value={balanceArr[1]}
              size="large"
              style={{ width: "100%", justifyContent: "flex-end" }}
            />
            <IconButton
              style={{ borderRadius: 4 }}
              onClick={() => setBalanceVisibility(!balanceVisibility)}
            >
              {balanceVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Box>
        </Box>
      </Paper>
      <BurnrDivider />
      <NavTabs />
    </BalanceVisibleContext.Provider>
  )
}

export default Home
