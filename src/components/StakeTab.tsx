import React, {useContext } from "react"

import {
  Theme,
  makeStyles,
  alpha as fade,
} from "@material-ui/core"

import { AccountContext } from "../utils/contexts"
import { ErrorBoundary, StakeRow } from "."
import { StakeData, StakeColumn } from "../utils/types"
import { useBalance } from "../hooks"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper"
import CircularProgress from "@mui/material/CircularProgress"

const columns: StakeColumn[] = [
  { id: "address", label: "Hotkey", width: 160 },
  { id: "stake", label: "Stake" },
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
}))

interface PropsStakeTab {
  rows: StakeData[],
  loader: boolean,
  refreshStake: (hotkeyAddr: string) => void,
}


export default function StakeTab({ rows, loader, refreshStake }: PropsStakeTab) {
  const classes = useStyles()
  const { account } = useContext(AccountContext)
  const balanceArr = useBalance(account?.accountAddress || "")
  const unit = balanceArr[3]

  const handleChange = (panel: string) => {
    setExpanded(expanded === panel ? false : panel);
  };

  
  const [expanded, setExpanded] = React.useState<string | false>(false);

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
          {rows?.map((row, i) => {
            return (
              <StakeRow refreshStake={refreshStake} expanded={expanded} onChange={() => handleChange(row['address'])} unit={unit} key={`row-${row.address}`} row={row} columns={columns} />
            )
          })}
        </ErrorBoundary>
      </Box>
    </React.Fragment>
  }
    </Stack>
  )
}



