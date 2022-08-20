import ContentCopyIcon from '@mui/icons-material/ContentCopy';  
import Button from "@mui/material/Button"

interface CopyAddressProps {
    accountAddress: string
}

export default function CopyAddressButton({ accountAddress }: CopyAddressProps) {
    const copyAddress = (address: string) => { 
        const el = document.createElement('textarea');
        el.value = address;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }

    return (
        <Button variant="outlined" color="primary" startIcon={<ContentCopyIcon />} onClick={() => copyAddress(accountAddress)}>
            {accountAddress}
        </Button>
    )
}