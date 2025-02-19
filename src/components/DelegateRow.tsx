import { AccountCard, BalanceValue, ErrorBoundary } from ".";
import {
  DelegateColumn,
  DelegateInfo,
  DelegateInfoRow,
  DelegateExtra,
} from "../utils/types";
import { BN } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import StakeForm from "./StakeForm";

import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { Theme, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import "../assets/styles/DelegateRow.css";
import { getOnChainIdentity } from "../utils/api";
import { useApi } from "../hooks";

interface Props {
  delegate: DelegateInfo;
  columns: DelegateColumn[];
  unit?: string;
  coldkey_ss58: string;
  expanded: string | false;
  onChange?: () => void;
  refreshMeta: () => void;
  delegateExtra: DelegateExtra | undefined;
  netuid: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  stake_display: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
}));

export default function DelegateRow({
  columns,
  unit,
  delegate,
  expanded,
  onChange,
  refreshMeta,
  coldkey_ss58,
  delegateExtra,
  netuid,
}: Props) {
  const [delegate_row, setDelegateRow] = React.useState<DelegateInfoRow>(
    {} as DelegateInfoRow
  );
  const classes = useStyles();

  const apiCtx = useApi();

  useEffect(() => {
    const getIdentity = async () => {
      const identity = await getOnChainIdentity(
        apiCtx.api,
        delegate.delegateSs58
      );

      if (identity.name || identity.image) {
        if (!!delegateExtra) {
          delegateExtra = {
            name: identity.name || "",
            url: "",
            description: "",
            signature: "",
            identity: identity,
          };
        } else {
          delegateExtra = {
            name: identity.name || delegate.delegateSs58,
            url: "",
            description: "",
            signature: "",
            identity: identity,
          };
        }
      }
    };

    getIdentity();

    let _row: DelegateInfoRow = {
      stake: delegate.stake,
      take: delegate.take,
      ownerSs58: delegate.ownerSs58,
      delegateSs58: delegate.delegateSs58,
      totalStake: delegate.totalStake,
      nominators: delegate.nominators.length,
    };

    setDelegateRow({
      ...delegate_row,
      ..._row,
    });
  }, [netuid, delegate, coldkey_ss58]);

  return (
    <React.Fragment>
      <ErrorBoundary>
        {!!Object.keys(delegate_row).length && (
          <Accordion
            expanded={expanded === delegate_row.delegateSs58}
            onChange={onChange}
            id="delegates"
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                {columns.map((column) => {
                  if (!["delegateSs58"].includes(column.id)) {
                    return null;
                  }
                  const value: string | number = delegate_row[column.id];
                  return (
                    <React.Fragment key={column.id}>
                      <Box flex={2}>
                        {column.id === "delegateSs58" && (
                          <AccountCard
                            account={{
                              address: value.toString(),
                              name: delegateExtra?.name || "",
                            }}
                            addressFormat="Compact"
                          />
                        )}
                      </Box>
                    </React.Fragment>
                  );
                })}
                <Stack
                  direction="column"
                  className="delegatestats-headings"
                  flex={3}
                >
                  {columns.map((column) => {
                    if (!["totalStake"].includes(column.id)) {
                      return null;
                    }
                    const value: string | number = delegate_row[column.id];
                    return (
                      <React.Fragment key={column.id}>
                        <Stack direction="row" alignItems="center">
                          <Typography className={classes.stake_display}>
                            Total Stake:
                          </Typography>
                          <BalanceValue
                            isVisible={true}
                            value={new BN(value) as Balance}
                            unit={unit}
                            size="small"
                            style={{
                              width: "100%",
                              justifyContent: "flex-end",
                            }}
                          />
                        </Stack>
                      </React.Fragment>
                    );
                  })}
                  {columns.map((column) => {
                    if (!["stake"].includes(column.id)) {
                      return null;
                    }
                    const value: string | number = delegate_row[column.id];
                    return (
                      <React.Fragment key={column.id}>
                        <Stack direction="row" alignItems="center">
                          <Typography className={classes.stake_display}>
                            Your Stake:
                          </Typography>
                          <BalanceValue
                            isVisible={true}
                            value={new BN(value) as Balance}
                            unit={unit}
                            size="small"
                            style={{
                              width: "100%",
                              justifyContent: "flex-end",
                            }}
                          />
                        </Stack>
                      </React.Fragment>
                    );
                  })}
                </Stack>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                {columns.map((column) => {
                  if (!["ownerSs58"].includes(column.id)) {
                    return null;
                  }
                  const value: string | number = delegate_row[column.id];
                  return (
                    <React.Fragment key={column.id}>
                      {column.id === "ownerSs58" && (
                        <Box flex={3}>
                          <AccountCard
                            account={{
                              address: value.toString(),
                              name: "Delegate Coldkey",
                            }}
                            addressFormat="Short"
                          />
                        </Box>
                      )}
                    </React.Fragment>
                  );
                })}
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  flex={3}
                >
                  {columns.map((column) => {
                    if (!["stake", "nominators"].includes(column.id)) {
                      return null;
                    }
                    const value: string | number = delegate_row[column.id];
                    return (
                      <React.Fragment key={column.id}>
                        {["nominators"].includes(column.id) &&
                          typeof value === "number" && (
                            <React.Fragment>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                              >
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  Nominators:
                                </Typography>
                                <Typography
                                  style={{
                                    width: "100%",
                                    justifyContent: "flex-end",
                                    display: "flex",
                                    paddingRight: "0.5em",
                                  }}
                                >
                                  {value.toString()}
                                </Typography>
                              </Stack>
                            </React.Fragment>
                          )}
                        {["stake"].includes(column.id) &&
                          typeof value === "number" && (
                            <React.Fragment>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                              >
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  Your Stake:
                                </Typography>
                                <BalanceValue
                                  isVisible={true}
                                  value={new BN(value) as Balance}
                                  unit={unit}
                                  size="small"
                                  style={{
                                    width: "100%",
                                    justifyContent: "flex-end",
                                  }}
                                  round={false}
                                />
                              </Stack>
                            </React.Fragment>
                          )}
                      </React.Fragment>
                    );
                  })}
                </Stack>
              </Stack>
              <Box
                justifyContent="flex-end"
                flexDirection="row"
                alignItems="center"
              >
                <ErrorBoundary>
                  <StakeForm
                    hotkeyAddr={delegate_row.delegateSs58}
                    stake={delegate_row.stake}
                    refreshMeta={refreshMeta}
                    netuid={netuid}
                  />
                </ErrorBoundary>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </ErrorBoundary>
    </React.Fragment>
  );
}
