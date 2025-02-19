import React, {
    MouseEvent,
    useContext,
    useState,
    useEffect,
    useCallback
  } from "react"
import { BN } from "@polkadot/util"
import { Theme, Typography, LinearProgress, Table, Box, TableBody } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import Stack from "@mui/material/Stack"
import { Keyring } from "@polkadot/keyring"
import { AccountContext } from "../utils/contexts"
import { ErrorBoundary, InputFunds } from "."
import { useBalance, useApi, useLocalStorage } from "../hooks"
import { HistoryTableRow } from "."
import { Column } from "../utils/types"
import { NETWORKS } from "../utils/constants"
import { web3FromAddress } from "@polkadot/extension-dapp"
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Hash } from "@polkadot/types/interfaces"

const useStyles = makeStyles((theme: Theme) => ({
  errorMessage: {
    padding: `${theme.spacing()}px 0px`,
    textAlign: "center"
  },
  button: {
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    "&:hover": {
      color: theme.palette.getContrastText(theme.palette.secondary.dark),
    },
    display: "block",
    margin: "10px auto",
  },
  transferInfoMessage: {
    overflowWrap: "break-word",
    padding: "30px",
  },
  infoRow: {
    margin: "30px 0",
  },
  feePriceAndBalance: {
    height: "55px",
    display: "flex",
    margin: "0 auto",
    justifyContent: "center",
    alignItems: "baseline",
  },
  title: {
    paddingRight: "30px",
    opacity: 1,
  },
  priceBalance: {
    backgroundColor: "#E7FAEC",
  },
  priceFee: {
    backgroundColor: "#FFE0DC",
  },
  price: {
    padding: "0 10px",
    borderRadius: "2px",
    color: "#1E1E1E",
    fontWeight: 90,
    opacity: 1,
  },
  opacityNone: {
    opacity: 0,
  },
}))

const columns: Column[] = [
  { id: "withWhom", label: "", width: 160 },
  { id: "extrinsic", label: "Extrinsic" },
  { id: "value", label: "Value", minWidth: 170, align: "right" },
  { id: "status", label: "Status", width: 40, align: "right" },
]

interface StakeFormProps {
  hotkeyAddr: string,
  stake: string | number,
  refreshMeta: () => void,
  netuid: number,
}

export default function StakeForm({ hotkeyAddr, stake, refreshMeta, netuid }: StakeFormProps) {
  const classes = useStyles()
  const { account, setCurrentAccount } = useContext(AccountContext)
  const balanceArr = useBalance(account.accountAddress)
  const { api, network }= useApi()
  const maxAmountFull = balanceArr[1]
  const unit = balanceArr[3]
  // TODO: This must be prettier and reusable (exists already on App)
  const [endpoint, setEndpoint] = useLocalStorage("endpoint")
  if (!endpoint) {
    setEndpoint(Object.keys(NETWORKS[parseInt(network)])[0])
  }
  // TODO END: This must be prettier and reusable (exists already on App)
  const [amount, setAmount] = useState<string>("0")
  const [fundsIssueStake, setFundsIssueStake] = useState<boolean>(false)
  const [fundsIssueUnstake, setFundsIssueUnstake] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [countdownNo, setCountdownNo] = useState<number>(0)
  const [rowStatus, setRowStatus] = useState<number>(0)
  const [txBlockHash, setTXBlockHash] = useState<Hash | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")
  
  // AddStake=false, RemoveStake=true
  const [lastAction, setLastAction] = useState<boolean>(false)
  const [lastAmount, setLastAmount] = useState<string>("0")

  useEffect((): (() => void) => {
    let countdown: ReturnType<typeof setInterval>
    if (!loading) {
      if (message !== "") {
        countdown = setInterval((): void => {
          setCountdownNo((oldCountdownNo: number) => {
            if (oldCountdownNo === 0) {
              setMessage("")
              return 0
            } else {
              return oldCountdownNo - 1
            }
          })
        }, 100)
      }
    }
    return () => {
      clearInterval(countdown)
    }
  }, [loading, message, setMessage])

  const handleStake = async (e: MouseEvent) => {
    e.preventDefault()
    const stakeAmount = amount
    setLastAmount(stakeAmount)
    try {
      e.preventDefault()
      setLoading(true)
      setCountdownNo(100)
      setRowStatus(3)
      setTXBlockHash(null)
      const keyring = new Keyring({ type: "sr25519" })
      const sender = account.accountAddress;
      const injector = await web3FromAddress(sender);
      setLastAction(false)
      await api.tx.subtensorModule
        .addStake(hotkeyAddr, netuid, stakeAmount)
        .signAndSend( sender, { signer: injector.signer, withSignedTransaction: true }, (result) => {
          setMessage(`Current transaction status ${result.status}`)
          if (result.status.isInBlock) {
            setCountdownNo(100)
            setMessage(`Transaction Block hash: ${result.status.asInBlock}`)
          } else if (result.status.isFinalized) {
            setRowStatus(1)
            setCountdownNo(100)
            setTXBlockHash(result.status.asFinalized)
            setMessage(`Block hash:: ${result.status.asFinalized}.`)
            account.userHistory.unshift({
              withWhom: hotkeyAddr,
              extrinsic: "AddStake",
              value: stakeAmount,
              status: 1,
              blockHash: result.status.asFinalized
            })
            setCurrentAccount(account)
          }
        })
      setLoading(false)
      refreshMeta()
      setAmount("0")
    } catch (err) {
      setLoading(false)
      setRowStatus(2)
      setTXBlockHash(null)
      setMessage(`😞 Error: ${err}`)
      account.userHistory.unshift({
        withWhom: hotkeyAddr,
        extrinsic: "AddStake",
        value: stakeAmount,
        status: 2,
        blockHash: null
      })
      setCurrentAccount(account)
    }
  }

  const handleUnstake = async (e: MouseEvent) => {
    e.preventDefault()
    const unstakeAmount = amount
    setLastAmount(unstakeAmount)
    try {
      e.preventDefault()
      setLoading(true)
      setCountdownNo(100)
      setRowStatus(3)
      setLastAction(true)
      const keyring = new Keyring({ type: "sr25519" })
      const sender = account.accountAddress;
      const injector = await web3FromAddress(sender);
      await api.tx.subtensorModule
        .removeStake(hotkeyAddr, netuid, unstakeAmount)
        .signAndSend( sender, { signer: injector.signer, withSignedTransaction: true }, (result) => {
          setMessage(`Current transaction status ${result.status}`)
          if (result.status.isInBlock) {
            setCountdownNo(100)
            setMessage(`Transaction Block hash: ${result.status.asInBlock}`)
          } else if (result.status.isFinalized) {
            setRowStatus(1)
            setCountdownNo(100)
            setTXBlockHash(result.status.asFinalized)
            setMessage(`Block hash:: ${result.status.asFinalized}.`)
            account.userHistory.unshift({
              withWhom: hotkeyAddr,
              extrinsic: "RemoveStake",
              value: unstakeAmount,
              status: 1,
              blockHash: result.status.asFinalized
            })
            setCurrentAccount(account)
          }
        })
      setLoading(false)
      refreshMeta()
      setAmount("0")
    } catch (err) {
      setLoading(false)
      setRowStatus(2)
      setTXBlockHash(null)
      setMessage(`😞 Error: ${err}`)
      account.userHistory.unshift({
        withWhom: hotkeyAddr,
        extrinsic: "RemoveStake",
        value: unstakeAmount,
        status: 2,
        blockHash: null
      })
      setCurrentAccount(account)
    }
  }

  useEffect(() => {
    maxAmountFull &&
      amount &&
      setFundsIssueStake(new BN(maxAmountFull).sub(new BN(amount)).isNeg())
  }, [amount, maxAmountFull])

  useEffect(() => {
    stake &&
      amount &&
      setFundsIssueUnstake(new BN(stake).sub(new BN(amount)).isNeg())
  }, [amount, stake])

  useEffect(() => {
    if (!!amount && !parseInt(amount)) {
      setErrorMsg("Specify an amount")
    } else {
      setErrorMsg("")
    }
  }, [amount])

  

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" paddingY={2} >
        <ErrorBoundary>
          <InputFunds
              total={maxAmountFull}
              currency={unit}
              setAmount={setAmount}
            />
        </ErrorBoundary>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          >
          <Button
          type="submit"
          variant="contained"
          size="medium"
          color="primary"
          disabled={
              loading ||
              (!parseInt(amount) || parseInt(amount) === 0) ||
              fundsIssueStake
          }
          onClick={handleStake}
          className={classes.button}
          >
          Stake
          </Button>
          <Button
          type="submit"
          variant="contained"
          size="medium"
          color="primary"
          disabled={
              loading ||
              (!parseInt(amount) || parseInt(amount) === 0) ||
              fundsIssueUnstake
          }
          onClick={handleUnstake}
          className={classes.button}
          >
          Unstake
          </Button>
          </ButtonGroup>
      </Stack>
      

      
        <Typography
          variant="body2"
          color="error"
          className={classes.errorMessage}
        >
          {errorMsg}
        </Typography>
      

      {message &&
      <Box mt={3}>
        {countdownNo !== 0 && (
          <Table size="small">
            <TableBody>
              <HistoryTableRow
                row={{
                  withWhom: hotkeyAddr,
                  value: lastAmount,
                  status: rowStatus,
                  extrinsic: lastAction ? "RemoveStake": "AddStake",
                  blockHash: txBlockHash
                }}
                unit={unit}
                columns={columns}
              />
            </TableBody>
          </Table>
        )}
        
        <Typography variant="subtitle2" className={classes.transferInfoMessage}>
          {message}
        </Typography>
        {!loading && countdownNo !== 0 && (
          <LinearProgress variant="determinate" value={countdownNo} />
        )}
      </Box>}
    </React.Fragment>
  )
}
  