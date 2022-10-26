import { FunctionComponent, useContext } from "react"

import {
  Theme,
  makeStyles,
  alpha as fade,
} from "@material-ui/core/styles"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

import { AccountContext } from "../utils/contexts"
import { HistoryTableRow } from "."
import { Data, Column } from "../utils/types"
import { useBalance } from "../hooks"

const columns: Column[] = [
  { id: "withWhom", label: "", minWidth: 150 },
  { id: "extrinsic", label: "Extrinsic" },
  { id: "value", label: "Value", minWidth: 30 },
  { id: "status", label: "Status", minWidth: 40, align: "right" },
  { id: "blockHash", label: "Block Hash", maxWidth: 100, align: "right" },
]

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    tableLayout: "fixed",
    width: "100%",
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
}))

const HistoryTable: FunctionComponent = () => {
  const classes = useStyles()
  const { account } = useContext(AccountContext)
  const rows: Data[] = account.userHistory
  const balanceArr = useBalance(account?.accountAddress || "")
  const unit = balanceArr[3]

  return (
    <Table size="small" stickyHeader className={classes.table}>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows?.map((row, i) => {
          return (
            <HistoryTableRow unit={unit} key={i} row={row} columns={columns} />
          )
        })}
      </TableBody>
    </Table>
  )
}

export default HistoryTable
