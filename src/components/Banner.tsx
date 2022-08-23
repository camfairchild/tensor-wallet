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
            This website is not affiliated with the Opentensor Foundation.
            <br />
            By using this website you agree that we, the authors of this software, are <strong>NOT</strong> liable for any loss of funds.
            <br />
            This website is <strong>NOT</strong> audited and you are fully responsible for any risks you may incur.
        </Alert>
      </Modal>
    )
}