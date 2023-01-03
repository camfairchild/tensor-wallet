import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useContext } from "react";
import { makeStyles, alpha as fade, } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccountContext } from "../utils/contexts";
import { HistoryTableRow } from ".";
import { useBalance, useApi } from "../hooks";
import { Button } from "@material-ui/core";
const columns = [
    { id: "withWhom", label: "", minWidth: 150 },
    { id: "extrinsic", label: "Extrinsic" },
    { id: "value", label: "Value", minWidth: 30 },
    { id: "status", label: "Status", minWidth: 40, align: "right" },
    { id: "blockHash", label: "Block Hash", maxWidth: 100, align: "right" },
];
const useStyles = makeStyles((theme) => ({
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
    loadingPaper: {
        height: "calc(100vh - 150px)",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));
const HistoryTableInner = ({ rows, balanceArr }) => {
    const classes = useStyles();
    const unit = balanceArr[3];
    return (_jsxs(Table, { size: "small", stickyHeader: true, className: classes.table, children: [_jsx(TableHead, { children: _jsx(TableRow, { children: columns.map((column) => (_jsx(TableCell, { align: column.align, style: {
                            width: column.width,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                        }, children: column.label }, column.id))) }) }), _jsx(TableBody, { children: rows?.map((row, i) => {
                    return (_jsx(HistoryTableRow, { unit: unit, row: row, columns: columns }, i));
                }) })] }));
};
async function __find_extrinsics(apiCtx, interval, end_block, ss58_address) {
    const extrinsics = [];
    const start_block = end_block - interval;
    const blockRange = [start_block, end_block];
    const { api } = apiCtx;
    // Wait for the API to be connected to the node
    try {
        await api.connect();
        await api.isReady;
    }
    catch (err) {
        console.log(err);
        return;
    }
    for (let i = blockRange[0]; i <= blockRange[1]; i++) {
        let extrinsics_at_block;
        // no blockHash is specified, so we retrieve the latest
        const blockHash = await api.rpc.chain.getBlockHash(i);
        const signedBlock = await api.rpc.chain.getBlock(blockHash);
        // get the api and events at a specific block
        const apiAt = await api.at(signedBlock.block.header.hash);
        const allRecords = await apiAt.query.system.events();
        // map between the extrinsics and events
        extrinsics_at_block = signedBlock.block.extrinsics
            .map(({ method: { method, section }, signer }, index) => {
            const filtered_events = allRecords
                // filter the specific events based on the phase and then the
                // index of our extrinsic in the block
                .filter(({ phase }) => phase.isApplyExtrinsic &&
                phase.asApplyExtrinsic.eq(index))
                // test the events against the specific types we are looking for
                .map(({ event }) => {
                let value;
                let withWhom = "";
                if (api.events.system.ExtrinsicSuccess.is(event)) {
                    // extract the data for this event
                    // (In TS, because of the guard above, these will be typed)
                    if (section === "balances" && method === "Transfer") {
                        // Transfer Extrinsic
                        const data = event.data;
                        const to = data[0].to.toHuman();
                        const amount = (data[0].amount.toHuman() / 1e9).toFixed(4) + " TAO";
                        value = { to, amount };
                        withWhom = to;
                    }
                    else if (section === "subtensorModule" && method === "WeightsSet") {
                        // Weights Set event
                        // skip
                        return null;
                    }
                    else if (section === "subtensorModule" && method === "AxonServed") {
                        // Axon Served event
                        // skip
                        return null;
                    }
                    else if (section === "subtensorModule" && method === "NeuronRegistered") {
                        // Neuron Registered event
                        const uid = event.data[0].toHuman();
                        value = `UID: ${uid}`;
                    }
                    else if (section === "subtensorModule" && method === "StakeAdded") {
                        // Stake Added event
                        const data = event.data;
                        const amount = (data[0].ammountStaked.toHuman() / 1e9).toFixed(4) + " TAO";
                        value = `Stake: ${amount}`;
                    }
                    else if (section === "subtensorModule" && method === "StakeRemoved") {
                        // Stake Removed event
                        const data = event.data;
                        const amount = (data[0].ammountUnstaked.toHuman() / 1e9).toFixed(4) + " TAO";
                        value = `Unstake: ${amount}`;
                    }
                    const status = "success";
                    const blockHash = signedBlock.block.header.hash.toHuman();
                    const extrinsic = `${section}.${method}`;
                    const row = { value, extrinsic, status, blockHash };
                    extrinsics.push(row);
                }
                else if (api.events.system.ExtrinsicFailed.is(event)) {
                    // extract the data for this event
                    const [dispatchError, dispatchInfo] = event.data;
                    let errorInfo;
                    // decode the error
                    if (dispatchError.isModule) {
                        // for module errors, we have the section indexed, lookup
                        // (For specific known errors, we can also do a check against the
                        // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
                        const decoded = api.registry.findMetaError(dispatchError.asModule);
                        errorInfo = `${decoded.section}.${decoded.name}`;
                        if (decoded.section === "subtensorModule" && method === "WeightsSet") {
                            // Set Weights Extrinsic
                            // skip
                            return null;
                        }
                        else if (decoded.section === "subtensorModule" && method === "AxonServed") {
                            // Axon Served Extrinsic
                            // skip
                            return null;
                        }
                        else if (decoded.section === "subtensorModule" && method === "NeuronRegistered") {
                            // Neuron Registered Extrinsic
                            // skip
                            return null;
                        }
                    }
                    else {
                        // Other, CannotLookup, BadOrigin, no extra info
                        errorInfo = dispatchError.toString();
                    }
                    return {
                        withWhom: "",
                        extrinsic: `${section}.${method}`,
                        status: "failed",
                        value: errorInfo,
                        blockHash: signedBlock.block.header.hash.toHuman()
                    };
                }
            })
                .filter((x) => x !== null); // remove nulls
            return filtered_events;
        })
            .flat();
        extrinsics.push(...extrinsics_at_block);
    }
    return {
        start_block,
        end_block,
        extrinsics,
    };
}
const HistoryTable = ({ interval = 7200 }) => {
    const { account } = useContext(AccountContext);
    const balanceArr = useBalance(account?.accountAddress || "");
    const [rows, setRows] = React.useState([]);
    const classes = useStyles();
    const [loader, setLoader] = React.useState(false);
    const apiCtx = useApi();
    const [lastBlockStart, setLastBlockStart] = React.useState(null);
    const getLastBlocks = async () => {
        setLoader(true);
        const currBlock = await apiCtx.api.rpc.chain.getBlock();
        const currBlockNum = currBlock.block.header.number.toNumber();
        try {
            const extrinsicsResult = await __find_extrinsics(apiCtx, interval, currBlockNum, account.accountAddress);
            return extrinsicsResult;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    };
    const onRefresh = () => {
        setLoader(true);
        (async () => {
            const lastExtrinsicsResult = await getLastBlocks();
            if (!lastExtrinsicsResult) {
                setLoader(false);
                return;
            }
            setRows(lastExtrinsicsResult.extrinsics);
            setLastBlockStart(lastExtrinsicsResult.start_block);
            setLoader(false);
        })();
    };
    const loadMore = () => {
        lastBlockStart && ((async () => {
            setLoader(true);
            try {
                const extrinsicsResult = await __find_extrinsics(apiCtx, interval, lastBlockStart - 1, account.accountAddress);
                if (!extrinsicsResult) {
                    setLoader(false);
                    return null;
                }
                setLastBlockStart(extrinsicsResult.start_block);
                return extrinsicsResult;
            }
            catch (err) {
                console.log(err);
                return null;
            }
        })());
    };
    React.useEffect(() => {
        onRefresh();
    }, []);
    return (_jsxs(Stack, { spacing: 2, direction: "column", divider: _jsx(Divider, { orientation: "vertical", flexItem: true }), children: [_jsx(Button, { onClick: () => onRefresh(), startIcon: _jsx(RefreshIcon, {}) }), loader ? (_jsx(Paper, { className: classes.loadingPaper, children: _jsxs(Stack, { spacing: 2, direction: "column", justifyContent: "center", children: [_jsx(Box, { children: _jsx(CircularProgress, { color: "primary" }) }), _jsx(Typography, { variant: "body2", children: "Syncing the Chain" })] }) })) :
                _jsx(React.Fragment, { children: _jsx(HistoryTableInner, { rows: rows, balanceArr: balanceArr }) }), _jsx(Button, { onClick: () => loadMore(), startIcon: _jsx(ExpandMoreIcon, {}) })] }));
};
export default HistoryTable;
