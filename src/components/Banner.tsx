import {useState} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

export default function Banner() {
    const [open, setOpen] = useState<boolean>(true);

    return (
    <Modal keepMounted
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Alert severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
            <AlertTitle>Legal Disclaimer</AlertTitle>
            This website is not affiliated with the Opentensor Foundation and is accepted “as is” with no representation or warranty of any kind.
            <br />
            By using this website and all the services it provides, the consumer acknowledges that the “authors” of this software, shall <strong>NOT</strong> be held liable for any loss of funds.
            <br />
            The authors have no obligation to indemnify, defend, or hold harmless consumer, including without limitation against claims related to liability or infringement of intellectual property rights.
            <br />
            This website is <strong>NOT</strong> audited and the consumer accepts wholly the responsibilities associated with any risks incurred.
        </Alert>
      </Modal>
    )
}