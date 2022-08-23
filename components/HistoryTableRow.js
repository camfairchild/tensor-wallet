import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from "react";
import { BN } from "@polkadot/util";
import { BalanceVisibleContext } from "../utils/contexts";
import { TableRow, TableCell } from "@material-ui/core";
import { AccountCard, BalanceValue, PopoverExtrinsic } from ".";
const HistoryTableRow = ({ columns, row, unit = "TAO", showStatus = true, }) => {
    const { balanceVisibility } = useContext(BalanceVisibleContext);
    return (_jsx(TableRow, { hover: true, children: columns.map((column) => {
            const value = row[column.id];
            return (_jsxs(TableCell, { align: column.align, children: [column.id === "withWhom" && (_jsx(AccountCard, { account: { address: value.toString(), name: "" } })), column.id === "extrinsic" && value, column.id === "value" && // This may look overwhelming but is just for "dump" data until page is fixed
                        (typeof value === "number" || typeof value === "string") && (_jsx(BalanceValue, { isVisible: balanceVisibility, value: new BN(value), unit: unit })), showStatus && column.id === "status" && (_jsx(PopoverExtrinsic, { status: row.status }))] }, `transaction-${column.id}`));
        }) }, `transaction`));
};
export default HistoryTableRow;
