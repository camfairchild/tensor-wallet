import React, { FunctionComponent, useState } from "react";
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
    backgroundColor: "transparent",
  },
  typo: {
    color: theme.palette.text.secondary,
  },
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
  const classes = useStyles();

  return (
    <React.Fragment>
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
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                fontSize: "1.2em",
                whiteSpace: "wrap",
                width: "10em",
              }}
              className={classes.typo}
            >
              {account.name}
            </Typography>
          )}
          <Typography
            variant="caption"
            className={classes.typo}
            sx={
              addressFormat === "Full"
                ? {}
                : addressFormat === "Short"
                ? {
                    textOverflow: "ellipsis",
                    overflowX: "clip",
                    width: "5em",
                  }
                : {
                    textOverflow: "ellipsis",
                    overflowX: "clip",
                    width: "10em",
                  }
            }
          >
            {account.address}
          </Typography>
        </Box>
      </Stack>
    </React.Fragment>
  );
};

export default AccountCard;
