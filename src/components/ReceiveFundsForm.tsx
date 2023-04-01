import { FunctionComponent, useContext } from "react"

import Stack from "@mui/material/Stack"
import QRCode from "qrcode.react"
import { AccountContext } from "../utils/contexts"
import CopyAddressButton from "./CopyAddressButton"
  
import Paper from "@material-ui/core/Paper"
import { makeStyles, useTheme } from "@material-ui/styles"
import { Theme } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) => ({
  qrParent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    margin: "1rem",
  },
  qr: {
    justifySelf: "center"
  }
}))

const ReceiveFundsForm: FunctionComponent = () => {
  const { account } = useContext(AccountContext)
  const classes = useStyles()
  const theme: Theme = useTheme() as Theme

  return (
    <Stack direction="column" width={600} justifyContent="center" >
      <Paper className={classes.qrParent} >
        <QRCode value={account.accountAddress} includeMargin={true} size={400} className={classes.qr} bgColor="transparent" fgColor={theme.palette.secondary.main} />
      </Paper>
      <CopyAddressButton accountAddress={account.accountAddress} />
    </Stack>
  )
}

export default ReceiveFundsForm
