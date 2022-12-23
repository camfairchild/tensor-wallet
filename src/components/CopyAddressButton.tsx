import ContentCopyIcon from '@mui/icons-material/ContentCopy';  
import Button from "@mui/material/Button"
import { copyToClipboard } from "../utils/utils"

interface CopyAddressProps {
    accountAddress: string
}

export default function CopyAddressButton({ accountAddress }: CopyAddressProps) {
    return (
        <Button variant="outlined" color="primary" startIcon={<ContentCopyIcon />} onClick={() => copyToClipboard(accountAddress)} sx={{
            textTransform: "none",
        }} >
            {accountAddress}
        </Button>
    )
}