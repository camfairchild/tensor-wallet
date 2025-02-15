import React, { useContext, useState } from "react";

import { Theme, alpha as fade } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { AccountContext } from "../utils/contexts";
import { ErrorBoundary, StakeRow } from ".";
import {
  StakeData,
  StakeColumn,
  DelegateInfo,
  DelegateColumn,
  DelegateExtras,
  StakeInfo,
} from "../utils/types";
import { useBalance } from "../hooks";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import Subnet from "./Subnet";
import DelegateRow from "./DelegateRow";

const columns: StakeColumn[] = [
  { id: "hotkey", label: "Hotkey", width: 160 },
  { id: "stake", label: "Stake" },
];

const delegateInfoColumns: DelegateColumn[] = [
  { id: "delegate_ss58", label: "Delegate Hotkey", width: 160 },
  { id: "owner_ss58", label: "Owner Coldkey", width: 160 },
  { id: "nominators", label: "Nominators" },
  { id: "total_stake", label: "Total Stake" },
  { id: "take", label: "Take" },
  { id: "stake", label: "Stake" },
];

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    "& th": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.disabled,
    },
    "& td, & th": {
      padding: theme.spacing(0.5),
      borderBottom: `1px solid ${fade(theme.palette.divider, 0.5)}`,
    },
    "& td:last-child, & th:last-child": {
      textAlign: "center",
    },
    "& tr:hover": {
      backgroundColor: "transparent !important",
      "& button": {
        backgroundColor: "rgba(0, 0, 0, 0.03)",
      },
    },
  },
  loadingPaper: {
    height: "calc(100vh - 150px)",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  subLoadingPaper: {
    height: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rowRoot: {
    maxHeight: "400px",
  },
  no_neurons_error: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
}));

interface PropsNeuronsTab {
  stakeData: StakeInfo[];
  delegateInfo: DelegateInfo[];
  loader: boolean;
  rowLoader: boolean;
  delegateLoader: boolean;
  refreshMeta: () => void;
  delegatesExtras: DelegateExtras;
}

export default function NeuronsTab({
  stakeData,
  loader,
  rowLoader,
  delegateLoader,
  refreshMeta,
  delegateInfo,
  delegatesExtras,
}: PropsNeuronsTab) {
  const classes = useStyles();
  const { account } = useContext(AccountContext);
  const balanceArr = useBalance(account?.accountAddress || "");
  const unit = balanceArr[3];
  const [page, setPage] = useState(1);

  const handleChange = (panel: string) => {
    setExpanded(expanded === panel ? false : panel);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [expandedDelegate, setExpandedDelegate] =
    React.useState<boolean>(false);

  const delegates_ss58 = delegateInfo.map((delegate) => delegate.delegate_ss58);
  const stakeDataNoDelegates = stakeData.filter(
    (stakeInfo: StakeInfo) => delegates_ss58.includes(stakeInfo.hotkey) === false
  );

  return (
    <Stack
      spacing={2}
      direction="column"
      divider={<Divider orientation="vertical" flexItem />}
    >
      {loader ? (
        <Paper className={classes.loadingPaper}>
          <Stack spacing={2} direction="column" justifyContent="center">
            <Box>
              <CircularProgress color="primary" />
            </Box>
            <Typography variant="body2">Syncing the Metagraph</Typography>
          </Stack>
        </Paper>
      ) : (
        <React.Fragment>
          <Stack
            direction="row"
            justifyContent="space-between"
            className={classes.table}
          >
            {columns.map((column) => (
              <Typography
                key={column.id}
                align={column.align}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                }}
              >
                {column.label}
              </Typography>
            ))}
          </Stack>
          <Box>
            <Box className={classes.rowRoot}>
              {rowLoader ? (
                <Paper className={classes.subLoadingPaper}>
                  <Stack spacing={2} direction="column" justifyContent="center">
                    <Box>
                      <CircularProgress color="primary" />
                    </Box>
                    <Typography variant="body2">
                      Syncing Metagraph...
                    </Typography>
                  </Stack>
                </Paper>
              ) : (
                <ErrorBoundary>
                  <Stack
                    direction="column"
                    spacing={1}
                    alignItems="center"
                    marginTop="2em"
                  >
                    {!!stakeDataNoDelegates.length &&
                      stakeDataNoDelegates.map((stakeInfo: StakeInfo) => {
                        return (
                          <StakeRow
                            refreshMeta={refreshMeta}
                            expanded={!!expanded ? expanded.slice(1) : expanded}
                            onChange={() =>
                              handleChange("0" + stakeInfo["hotkey"])
                            }
                            unit={unit}
                            key={`row-${stakeInfo.hotkey}-${stakeInfo.netuid}`}
                            row={stakeInfo}
                            columns={columns}
                          />
                        );
                      })}
                    {!!!stakeDataNoDelegates.length && (
                      <Typography
                        variant="body2"
                        className={classes.no_neurons_error}
                      >
                        Not Staked To Any Non-delegate Keys
                      </Typography>
                    )}
                  </Stack>
                </ErrorBoundary>
              )}
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Stack>
  );
}
