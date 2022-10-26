import { FunctionComponent, useContext } from "react"

import { BN } from "@polkadot/util"
import { BalanceVisibleContext } from "../utils/contexts"
import Typography from "@mui/material/Typography";
import { Balance, Hash } from "@polkadot/types/interfaces"
import { TableRow, TableCell } from "@material-ui/core"
import { Column } from "../utils/types"

import { AccountCard, BalanceValue, PopoverExtrinsic } from "."

interface rowContent {
  withWhom: string
  extrinsic: string
  value: string | number
  status: string | number
  blockHash: Hash | null
}
interface Props {
  row: rowContent
  columns: Column[]
  unit?: string
  showStatus?: boolean
}

const HistoryTableRow: FunctionComponent<Props> = ({
  columns,
  row,
  unit = "TAO",
  showStatus = true,
}) => {
  const { balanceVisibility } = useContext(BalanceVisibleContext)
  return (
    <TableRow hover key={`transaction-${row.blockHash}`}>
      {columns.map((column) => {
        const value: string | number | Hash | null = row[column.id]
        return (
          <TableCell key={`transaction-${column.id}`} align={column.align}>
            {column.id === "withWhom" && (
              <AccountCard account={{ address: (value as number).toString(), name: "" }} />
            )}
            {column.id === "extrinsic" && value}
            {column.id === "value" && // This may look overwhelming but is just for "dump" data until page is fixed
              (typeof value === "number" || typeof value === "string") && (
                <BalanceValue
                  isVisible={balanceVisibility}
                  value={new BN(value) as Balance}
                  unit={unit}
                />
              )}
            {showStatus && column.id === "status" && (
              <PopoverExtrinsic status={row.status} blockHash={row.blockHash} />
            )}
            <Typography variant="caption" sx={{
              textOverflow: "ellipsis",
              overflowX: "hidden",
              display: "inline-block",
              maxWidth: "100%",
            }} >
              {column.id === "blockHash" && value && (value as Hash).toHex()}
            </Typography>
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default HistoryTableRow
