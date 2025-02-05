import { useState, useEffect, FunctionComponent, useContext } from "react"
import makeStyles from '@mui/styles/makeStyles';

import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"

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
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  }
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
      <Stack spacing={2} direction="column" justifyContent="center">
          <Box>
            <CircularProgress color="primary" />
          </Box>
          <Typography variant="body2">Finding Accounts</Typography>
        </Stack>
    </Paper>
  ) : ( 
      accounts.length === 0 ? (
      <Paper className={classes.loadingPaper}>
        <Typography variant="body2">No Accounts Found</Typography>
      </Paper>
    ) : (
      <BalanceVisibleContext.Provider
        value={{ balanceVisibility, setBalanceVisibility }}
      >
        <Paper square className={classes.paperAccount} key={accounts.length}>
          <Box paddingY={1} paddingX={2} display="flex" alignItems="center" className={classes.paper} >
            <Box width="50%" display="flex" className={classes.paper}>
              {account?.accountAddress && (
                <>
                  <AccountCard
                    account={{
                      address: account?.accountAddress,
                      name: account?.accountName,
                    }}
                    addressFormat="Short"
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
                colored
              />
              <IconButton
                style={{ borderRadius: 4 }}
                onClick={() => setBalanceVisibility(!balanceVisibility)}
                size="large">
                {balanceVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Box>
          </Box>
        </Paper>
        <BurnrDivider />
        <NavTabs />
      </BalanceVisibleContext.Provider>
    )
  );
}

export default Home
