import React, { useContext, useEffect, useState } from "react";

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
import DelegateRow from "./DelegateRow";
import SubnetSelector, { useSubnet, SubnetProvider } from "./SubnetSelector";

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

interface PropsStakeTab {
  stakeData: StakeInfo[];
  delegateInfo: DelegateInfo[];
  loader: boolean;
  delegateLoader: boolean;
  refreshMeta: () => void;
  delegatesExtras: DelegateExtras;
  subnets: number[];
}

export default function StakeTab({
  stakeData,
  loader,
  delegateLoader,
  refreshMeta,
  delegateInfo: delegateInfo_raw,
  delegatesExtras,
  subnets,
}: PropsStakeTab) {
  const classes = useStyles();
  const { account } = useContext(AccountContext);
  const balanceArr = useBalance(account?.accountAddress || "");
  const unit = balanceArr[3];
  const [page, setPage] = useState(1);
  const { state: { netuid } } = useSubnet();
  const [delegateInfo, setDelegateInfo] = useState<DelegateInfo[]>([]);

  useEffect(() => {
    const stakeMap = new Map<string, StakeInfo>();
    const newDelegateInfo = [...delegateInfo_raw];
    console.log("refreshing delegate info");
    stakeData.forEach((stake) => {
      if (stake.netuid === netuid) {
        stakeMap.set(stake.hotkey, stake);
      }
    });
    newDelegateInfo.forEach((delegate) => {
      delegate.total_stake = delegate.total_stake;
      delegate.stake = Number(stakeMap.get(delegate.delegate_ss58)?.stake || 0);
    });
    console.log("newDelegateInfo", newDelegateInfo, stakeMap);
    newDelegateInfo.sort((a, b) => b.stake - a.stake || b.total_stake - a.total_stake);

    setDelegateInfo(newDelegateInfo);
  }, [netuid, delegateInfo_raw, stakeData]);

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

  return (
    <Stack
      spacing={2}
      direction="column"
      divider={<Divider orientation="vertical" flexItem />}
    >
      <SubnetProvider defaultNetuid={0}>
        <SubnetSelector subnets={subnets} >
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
                <Stack
                  direction="column"
                  spacing={1}
                  alignItems="center"
                  marginTop="2em"
                >
                  <Typography
                    variant="h2"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Delegates
                  </Typography>
                  {delegateLoader ? (
                    <Paper className={classes.subLoadingPaper}>
                      <Stack spacing={2} direction="column" justifyContent="center">
                        <Box>
                          <CircularProgress color="primary" />
                        </Box>
                        <Typography variant="body2">
                          Syncing Delegates...
                        </Typography>
                      </Stack>
                    </Paper>
                  ) : (
                    <ErrorBoundary>
                      {!!delegateInfo.length && (
                        <Stack
                          direction="column"
                          spacing={1}
                          alignItems="center"
                          marginTop="2em"
                        >
                          <List
                            style={{
                              minHeight: "400px",
                              padding: "0.5em",
                            }}
                          >
                            {delegateInfo
                              .slice((page - 1) * 5, page * 5)
                              .map((delegate) => {
                                return (
                                  <DelegateRow
                                    coldkey_ss58={account.accountAddress}
                                    refreshMeta={refreshMeta}
                                    expanded={expanded}
                                    onChange={() =>
                                      handleChange(delegate.delegate_ss58)
                                    }
                                    unit={unit}
                                    key={`row-${delegate.delegate_ss58}`}
                                    delegate={delegate}
                                    columns={delegateInfoColumns}
                                    delegateExtra={
                                      delegatesExtras[delegate.delegate_ss58]
                                    }
                                    netuid={netuid || 0}
                                  />
                                );
                              })}
                          </List>
                          <Pagination
                            count={Math.ceil(delegateInfo.length / 5)}
                            shape="rounded"
                            onChange={handlePageChange}
                            page={page}
                          />
                        </Stack>
                      )}
                      {!!!delegateInfo.length && (
                        <Typography
                          variant="body2"
                          className={classes.no_neurons_error}
                        >
                          No Delegates exist
                        </Typography>
                      )}
                    </ErrorBoundary>
                  )}
                </Stack>
              </Box>
            </React.Fragment>
          )}
        </SubnetSelector>
      </SubnetProvider>
    </Stack>
  );
}
