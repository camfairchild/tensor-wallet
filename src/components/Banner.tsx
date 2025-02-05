import {useState} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function Banner() {
    const [open, setOpen] = useState<boolean>(true);

    return (
    <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Alert severity="info" sx={{ mb: 2 }}>
        <Stack direction="column" spacing={1}>
          <Box>
                <AlertTitle>Legal Disclaimer</AlertTitle>
                This website is not affiliated with the Opentensor Foundation or Latent Holdings and is accepted “as is” with no representation or warranty of any kind.
                <br />
                By using this website and all the services it provides, the consumer acknowledges that the “authors” of this software, shall <strong>NOT</strong> be held liable for any loss of funds.
                <br />
                The authors have no obligation to indemnify, defend, or hold harmess consumer, including without limitation against claims related to liability or infringement of intellectual property rights.
                <br />
                This website is <strong>NOT</strong> audited and the consumer accepts wholly the responsibilities associated with any risks incurred.
                <br />
              </Box>
              <Button
                aria-label="accept terms"
                color="inherit"
                size="small"
                variant='outlined'
                onClick={() => {
                  setOpen(false);
                }}
                startIcon={<CheckIcon fontSize='inherit'/>}
              >
                I Have Read the Disclaimer and Accept
              </Button>
            </Stack>
        </Alert>
      </Modal>
    )
}