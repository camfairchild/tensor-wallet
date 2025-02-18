import { FunctionComponent, useState } from "react";
import Identicon from "@polkadot/react-identicon";

import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";

import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Account } from "../utils/types";
import { copyToClipboard } from "../utils/utils";
import { Theme } from "@mui/material";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: 'transparent'
  },
  typo: {
    color: theme.palette.text.secondary,
  }
}));

interface Props {
  account: Account;
  addressFormat?: "Full" | "Short" | "Compact";
}

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const AccountCard: FunctionComponent<Props> = ({
  account,
  addressFormat,
}: Props) => {
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const classes = useStyles();

  return (
    <>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={showCopied}
          autoHideDuration={2000}
          onClose={() => setShowCopied(false)}
          className={classes.root}
        >
          <Alert severity="success">Copied!</Alert>
        </Snackbar>
      <Stack
        spacing={1}
        direction={addressFormat === "Full" ? "column" : "row"}
        className={classes.root}
      >
        <Identicon
          size={32}
          theme="polkadot"
          value={account.address}
          onCopy={() => {
            setShowCopied(true);
            copyToClipboard(account.address);
          }}
        />
        <Box
          height={32}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          ml={1}
          className={classes.root}
        >
          {account.name !== "" && (
            <Typography variant="h2" sx={{ fontWeight: "bold", fontSize: "1.2em", whiteSpace: "wrap", width: "10em" }} className={classes.typo} >{account.name}</Typography>
          )}
          <Typography variant="caption" className={classes.typo} sx={addressFormat === "Full" ? {} : (addressFormat === "Short" ? {
            textOverflow: "ellipsis",
            overflowX: "clip",
            width: "5em",
          } : {
            textOverflow: "ellipsis",
            overflowX: "clip",
            width: "10em",
          })}>
            {account.address}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default AccountCard;
