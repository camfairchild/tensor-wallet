import { FunctionComponent, useContext } from "react"

import Stack from "@mui/material/Stack"
import QRCode from "qrcode.react"
import { AccountContext } from "../utils/contexts"
import CopyAddressButton from "./CopyAddressButton"

import ErrorBoundary from "./ErrorBoundary";
import { Paper } from "@mui/material"

const ReceiveFundsForm: FunctionComponent = () => {
  
  const { account } = useContext(AccountContext)
  return (
    <Stack direction="column" width={600} justifyContent="center" >
      <Paper style={styles.qrParent} >
        <QRCode value={account.accountAddress} includeMargin={true} size={400} style={{"justifySelf": "center"}} />
      </Paper>
      <CopyAddressButton accountAddress={account.accountAddress} />
    </Stack>
  )
}

const styles = {
  qrParent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    margin: "1rem",
  },
}

export default ReceiveFundsForm
