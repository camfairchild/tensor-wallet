import React, {useContext, useState } from "react"

import {
  Theme,
  makeStyles,
  alpha as fade
} from "@material-ui/core"

import { AccountContext } from "../utils/contexts"
import { ErrorBoundary, StakeRow } from "."
import { StakeData, StakeColumn, DelegateInfo, DelegateColumn, DelegateExtras } from "../utils/types"
import { useBalance } from "../hooks"
import Stack from "@mui/material/Stack"
import Box from "@material-ui/core/Box"
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper"
import Pagination from "@mui/material/Pagination"
import List from "@material-ui/core/List"
import CircularProgress from "@material-ui/core/CircularProgress"
import Subnet from "./Subnet"
import DelegateRow from "./DelegateRow"

const columns: StakeColumn[] = [
  { id: "address", label: "Hotkey", width: 160 },
  { id: "stake", label: "Stake" },
]

const delegateInfoColumns: DelegateColumn[] = [
  { id: "delegate_ss58", label: "Delegate Hotkey", width: 160 },
  { id: "owner_ss58", label: "Owner Coldkey", width: 160 },
  { id: "nominators", label: "Nominators" },
  { id: "total_stake", label: "Total Stake" },
  { id: "take", label: "Take" },
  { id: "stake", label: "Stake" }
]

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
  no_neurons_error: {
    textAlign: "center",
    padding: theme.spacing(2),
  }
}))

interface PropsStakeTab {
  stakeData: StakeData,
  delegateInfo: DelegateInfo[],
  loader: boolean,
  refreshMeta: () => void,
  delegatesExtras: DelegateExtras
}

export default function StakeTab({ stakeData, loader, refreshMeta, delegateInfo, delegatesExtras }: PropsStakeTab) {
  const classes = useStyles()
  const { account } = useContext(AccountContext)
  const balanceArr = useBalance(account?.accountAddress || "")
  const unit = balanceArr[3]
  const [page, setPage] = useState(1);

  const handleChange = (panel: string) => {
    setExpanded(expanded === panel ? false : panel);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [expandedDelegate, setExpandedDelegate] = React.useState<boolean>(false);

  return (
    <Stack spacing={2} direction="column" divider={<Divider orientation="vertical" flexItem />}>
    {loader ? (
      <Paper className={classes.loadingPaper}>
        <Stack spacing={2} direction="column" justifyContent="center">
          <Box>
            <CircularProgress color="primary" />
          </Box>
          <Typography variant="body2">Syncing the Metagraph</Typography>
        </Stack>
      </Paper>
    ) : 
  <React.Fragment>
      <Stack direction="row" justifyContent="space-between" className={classes.table}>
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
        <ErrorBoundary>
          {!!Object.keys(stakeData).length && Object.entries(stakeData).map(([netuid, neurons]) => {
            return <Stack spacing={2} direction="column" divider={<Divider orientation="vertical" flexItem />}>
              <Subnet netuid={netuid} >
                {neurons?.map((row, i) => {
                  return (
                    <StakeRow refreshMeta={refreshMeta} expanded={expanded} onChange={() => handleChange(row['address'])} unit={unit} key={`row-${row.address}`} row={row} columns={columns} />
                  )
                })}
                {!!!neurons.length && <Typography variant="body2" className={classes.no_neurons_error}>No Neurons Registered to this Coldkey</Typography>}
              </Subnet>
            </Stack>
          })}
          {!!!Object.keys(stakeData).length && <Typography variant="body2" className={classes.no_neurons_error}>No Subnets</Typography>}
        </ErrorBoundary>
        <ErrorBoundary>
          {!!delegateInfo.length && 
            <Stack direction="column" spacing={1} alignItems="center" marginTop="2em" >
              
              <Typography variant="h2" style={{
                    fontWeight: 'bold',
                  }} >
                    Delegates
              </Typography>
              <List style={{
                minHeight: "400px",
                padding: "0.5em",
              }} >
                  {delegateInfo.slice((page-1)*5, page*5).map((delegate) => {
                    return (
                      <DelegateRow 
                        coldkey_ss58={account.accountAddress}
                        refreshMeta={refreshMeta}
                        expanded={expanded}
                        onChange={() => handleChange(delegate.delegate_ss58)}
                        unit={unit}
                        key={`row-${delegate.delegate_ss58}`}
                        delegate={delegate}
                        columns={delegateInfoColumns}
                        delegateExtra={delegatesExtras[delegate.delegate_ss58]}
                      />
                    )
                  })}
              </List>
              <Pagination count={Math.ceil(delegateInfo.length/5)} shape="rounded" onChange={handlePageChange} page={page} />
            </Stack>
          }
          {!!!delegateInfo.length && <Typography variant="body2" className={classes.no_neurons_error}>No Delegates exist</Typography>}
        </ErrorBoundary>
      </Box>
    </React.Fragment>
  }
    </Stack>
  )
}



