import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useState, useEffect } from "react";
import { makeStyles, } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SwapHorizSharpIcon from "@material-ui/icons/SwapHorizSharp";
import CallMadeSharpIcon from "@material-ui/icons/CallMadeSharp";
import CallReceivedSharpIcon from "@material-ui/icons/CallReceivedSharp";
import TollIcon from '@mui/icons-material/Toll';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SendFundsForm, ReceiveFundsForm, BurnrDivider, HistoryTable, StakeTab, } from ".";
import { useApi } from "../hooks";
import { AccountContext } from "../utils/contexts";
import { useIsMountedRef } from "../hooks/api/useIsMountedRef";
const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: "calc(100vh - 265px)",
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        [theme.breakpoints.down("sm")]: {
            minHeight: "calc(100vh - 320px)",
        },
    },
    rootHeading: {
        marginBottom: theme.spacing(3),
    },
    rootTabs: {
        "& 	.MuiTabs-root": {
            minHeight: theme.spacing(8),
            ...theme.typography.overline,
            lineHeight: 1,
        },
    },
}));
const TabPanel = ({ children, value, index, ...props }) => {
    return (_jsx("div", { hidden: value !== index, id: `tabpanel-${index}`, ...props, children: value === index &&
            _jsx(Box, { p: 3, children: _jsx(Stack, { direction: "column", spacing: 2, children: children }) }) }));
};
const NavTabs = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { account } = useContext(AccountContext);
    const mountedRef = useIsMountedRef();
    const apiCtx = useApi();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [neurons, setNeurons] = useState([]);
    const [rows, setRows] = useState([]);
    const [loader, setLoader] = useState(true);
    const refreshMeta = async () => {
        const getMeta = async () => {
            setLoader(true);
            const numNeurons = (await apiCtx.api.query.subtensorModule.n()).words[0];
            let _neurons = [];
            const pageSize = Math.ceil(numNeurons / 4);
            for (let i = 0; i < 4; i++) {
                const indexStart = i * pageSize;
                const results = (await apiCtx.api.query.subtensorModule.neurons.multi([...Array(pageSize).keys()].map(i => i + indexStart)));
                let neurons_ = results.map((result, j) => {
                    const neuron = result.value;
                    return {
                        hotkey: neuron.hotkey.toString(),
                        coldkey: neuron.coldkey.toString(),
                        stake: neuron.stake.toNumber(),
                        uid: j + indexStart
                    };
                });
                _neurons.push(...neurons_);
            }
            return _neurons;
        };
        account && getMeta().then((_neurons) => {
            setNeurons(_neurons);
            setLoader(false);
        });
    };
    const refreshStake = async (hotkeyAddr) => {
        const getStake = async (neurons_) => {
            // get the uids of the neurons that are linked to the account
            const neuron_uids = neurons_.filter(neuron => {
                if (hotkeyAddr) {
                    return neuron.hotkey === hotkeyAddr && neuron.coldkey === account.accountAddress;
                }
                return neuron.coldkey === account.accountAddress;
            }).flatMap(neuron => {
                return neuron.uid;
            });
            // get the stake of each neuron that is linked to the account
            const results = (await apiCtx.api.query.subtensorModule.neurons.multi(neuron_uids));
            // map the results to a neuron array
            const _neurons = results.map((result, j) => {
                const neuron = result.value;
                return {
                    hotkey: neuron.hotkey.toString(),
                    coldkey: neuron.coldkey.toString(),
                    stake: neuron.stake.toNumber(),
                    uid: neuron_uids[j]
                };
            });
            // fill the new stake data with the old data and the new data
            neurons_ = neurons_.map(neuron => {
                const ind = _neurons.findIndex((n) => { return n.uid === neuron.uid; }, -1);
                if (ind !== -1) {
                    neuron.stake = _neurons[ind].stake;
                }
                return neuron;
            });
            return neurons_;
        };
        account && getStake(neurons).then((_neurons) => {
            setNeurons(_neurons);
        });
    };
    useEffect(() => {
        const getRows = async (neurons_) => {
            const rows_ = neurons_.filter(neuron => {
                return neuron.coldkey === account.accountAddress;
            }).map(neuron => {
                return {
                    address: neuron.hotkey,
                    stake: neuron.stake
                };
            });
            setRows(rows_);
        };
        mountedRef.current && neurons?.length && getRows(neurons);
    }, [account, mountedRef, neurons]);
    useEffect(() => {
        mountedRef.current && refreshMeta();
    }, [mountedRef, apiCtx]);
    return (_jsxs(_Fragment, { children: [_jsx(Paper, { square: true, children: _jsxs(Tabs, { value: value, onChange: handleChange, variant: "fullWidth", className: classes.rootTabs, children: [_jsx(Tab, { label: "Receipts", icon: _jsx(SwapHorizSharpIcon, { fontSize: "small" }) }), _jsx(Tab, { label: "Send", icon: _jsx(CallMadeSharpIcon, { fontSize: "small" }) }), _jsx(Tab, { label: "Receive", icon: _jsx(CallReceivedSharpIcon, { fontSize: "small" }) }), _jsx(Tab, { label: "Stake", icon: _jsx(TollIcon, { fontSize: "small" }) })] }) }), _jsx(BurnrDivider, {}), _jsxs(Paper, { className: classes.root, square: true, children: [_jsxs(TabPanel, { value: value, index: 0, children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Transaction History" }), _jsx(HistoryTable, {})] }), _jsxs(TabPanel, { value: value, index: 1, children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Send Tao" }), _jsx(SendFundsForm, {})] }), _jsxs(TabPanel, { value: value, index: 2, children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Receive Tao" }), _jsx(ReceiveFundsForm, {})] }), _jsxs(TabPanel, { value: value, index: 3, children: [_jsxs(Stack, { spacing: 2, direction: "row", children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Stake Tao" }), _jsx(Button, { onClick: () => refreshMeta(), startIcon: _jsx(RefreshIcon, {}) })] }), _jsx(StakeTab, { rows: rows, loader: loader, refreshStake: refreshStake })] })] })] }));
};
export default NavTabs;
