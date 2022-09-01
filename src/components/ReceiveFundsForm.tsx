import { FunctionComponent, useContext } from "react"

import Stack from "@mui/material/Stack"
import QRCode from "qrcode.react"
import { AccountContext } from "../utils/contexts"
import CopyAddressButton from "./CopyAddressButton"

import ErrorBoundary from "./ErrorBoundary";

const ReceiveFundsForm: FunctionComponent = () => {
  
  const { account } = useContext(AccountContext)
  return (
    <Stack direction="column" width={600} justifyContent="center" >
      <QRCode value={account.accountAddress} includeMargin={true} size={400} style={{"justifySelf": "center"}} />
      <ErrorBoundary>
        <CopyAddressButton accountAddress={account.accountAddress} />
      </ErrorBoundary>
    </Stack>
  )
}

export default ReceiveFundsForm
