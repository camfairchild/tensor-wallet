import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useState, useEffect, } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SwapHorizSharpIcon from "@material-ui/icons/SwapHorizSharp";
import CallMadeSharpIcon from "@material-ui/icons/CallMadeSharp";
import CallReceivedSharpIcon from "@material-ui/icons/CallReceivedSharp";
import TollIcon from "@mui/icons-material/Toll";
import RefreshIcon from "@mui/icons-material/Refresh";
import { SendFundsForm, ReceiveFundsForm, BurnrDivider, HistoryTable, StakeTab, ErrorBoundary, } from ".";
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
    return (_jsx("div", { hidden: value !== index, id: `tabpanel-${index}`, ...props, children: value === index && (_jsx(Box, { p: 3, children: _jsx(Stack, { direction: "column", spacing: 2, children: children }) })) }));
};
const NavTabs = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { account } = useContext(AccountContext);
    const mountedRef = useIsMountedRef();
    // for first load of page
    const [loaded, setLoaded] = useState(false);
    const apiCtx = useApi();
    const handleChange = (event, newValue) => {
        if (newValue === 3 && !loaded) {
            // refresh the page when the tab is clicked
            // but only do this once
            refreshMeta();
            getDelegateInfo().then((delegateInfo) => {
                setDelegateInfo(delegateInfo);
            });
            setLoaded(true);
        }
        setValue(newValue);
    };
    const [meta, setMeta] = useState({});
    const [stakeData, setStakeData] = useState({});
    const [loader, setLoader] = useState(true);
    const [delegateInfo, setDelegateInfo] = useState([]);
    const [delegatesExtras, setDelegatesExtras] = useState({
        "5ECvRLMj9jkbdM4sLuH5WvjUe87TcAdjRfUj5onN4iKqYYGm": {
            "name": "Vune",
            "url": "https://fairchild.dev",
            "description": "Vune is a dev at the Opentensor Foundation, and a CS student at the University of Toronto. He also maintains tensorwallet and tensorping.",
        }
    });
    const getNeurons = (netuids) => {
        return new Promise(async (resolve, reject) => {
            let results_map = {};
            for (let netuid of netuids) {
                apiCtx.api.rpc.neuronInfo
                    .getNeuronsLite(netuid)
                    .then((result_bytes) => {
                    const result = apiCtx.api.createType("Vec<NeuronInfoLite>", result_bytes);
                    const neurons_info = result.toJSON();
                    results_map[netuid] = neurons_info;
                })
                    .catch((err) => {
                    console.log(err);
                    reject(err);
                });
            }
            resolve(results_map);
        });
    };
    const getDelegateInfo = async () => {
        const result_bytes = await apiCtx.api.rpc.delegateInfo.getDelegates();
        const result = apiCtx.api.createType("Vec<DelegateInfo>", result_bytes);
        const delegate_info_raw = result.toJSON();
        const delegate_info = delegate_info_raw.map((delegate) => {
            let nominators = [];
            let total_stake = 0;
            for (let i = 0; i < delegate.nominators.length; i++) {
                const nominator = delegate.nominators[i];
                const staked = nominator[1];
                total_stake += staked;
                nominators.push([nominator[0].toString(), staked]);
            }
            return {
                take: delegate.take / (2 ** 16 - 1),
                delegate_ss58: delegate.delegate_ss58.toString(),
                owner_ss58: delegate.owner_ss58.toString(),
                nominators,
                total_stake,
            };
        });
        return delegate_info;
    };
    const getDelegatesJson = async () => {
        const url = "https://raw.githubusercontent.com/opentensor/bittensor/master/delegates.json";
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };
    const refreshMeta = async () => {
        const getMeta = async () => {
            setLoader(true);
            const subnets_info_bytes = await apiCtx.api.rpc.subnetInfo.getSubnetsInfo();
            const subnets_info = apiCtx.api.createType("Vec<SubnetInfo>", subnets_info_bytes);
            const netuids = subnets_info
                .toJSON()
                .map((subnetInfo) => {
                return subnetInfo.netuid;
            });
            let _meta = {};
            const result = await getNeurons(netuids);
            Object.entries(result).forEach(([netuid, neurons]) => {
                let neurons_ = neurons.map((neuron) => {
                    return {
                        hotkey: neuron.hotkey.toString(),
                        coldkey: neuron.coldkey.toString(),
                        stake: neuron.stake.tonumber(),
                        uid: neuron.uid,
                    };
                });
                _meta[netuid] = neurons_;
            });
            return _meta;
        };
        account &&
            getMeta().then((_meta) => {
                setMeta(_meta);
                setLoader(false);
            });
    };
    useEffect(() => {
        const getRows = async (meta_) => {
            let stakeData = {};
            stakeData = Object.fromEntries(Object.entries(meta_).map(([netuid, neurons]) => {
                return [
                    netuid,
                    neurons
                        .filter((neuron) => {
                        return neuron.coldkey === account.accountAddress;
                    })
                        .map((neuron) => {
                        return {
                            address: neuron.hotkey,
                            stake: neuron.stake,
                        };
                    }),
                ];
            }));
            setStakeData(stakeData);
        };
        mountedRef.current && !!meta && getRows(meta);
    }, [account, mountedRef, meta]);
    useEffect(() => {
        const _getDelegateInfo = async () => {
            let delegateInfo = await getDelegateInfo();
            let delegateInfo_sorted = delegateInfo.sort((a, b) => {
                return b.total_stake - a.total_stake;
            });
            setDelegateInfo(delegateInfo_sorted);
            getDelegatesJson().then((delegates_json) => {
                setDelegatesExtras(delegates_json);
            });
        };
        mountedRef.current && _getDelegateInfo();
    }, [account, mountedRef]);
    return (_jsxs(_Fragment, { children: [_jsx(Paper, { square: true, children: _jsxs(Tabs, { value: value, onChange: handleChange, variant: "fullWidth", className: classes.rootTabs, children: [_jsx(Tab, { label: "Receipts", icon: _jsx(SwapHorizSharpIcon, { fontSize: "small" }) }), _jsx(Tab, { label: "Send", icon: _jsx(CallMadeSharpIcon, { fontSize: "small" }) }), _jsx(Tab, { label: "Receive", icon: _jsx(CallReceivedSharpIcon, { fontSize: "small" }) }), _jsx(Tab, { label: "Stake", icon: _jsx(TollIcon, { fontSize: "small" }) })] }) }), _jsx(BurnrDivider, {}), _jsxs(Paper, { className: classes.root, square: true, children: [_jsx(TabPanel, { value: value, index: 0, children: _jsxs(ErrorBoundary, { children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Transaction History" }), _jsx(HistoryTable, {})] }) }), _jsx(TabPanel, { value: value, index: 1, children: _jsxs(ErrorBoundary, { children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Send TAO" }), _jsx(SendFundsForm, {})] }) }), _jsx(TabPanel, { value: value, index: 2, children: _jsxs(ErrorBoundary, { children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Receive TAO" }), _jsx(ReceiveFundsForm, {})] }) }), _jsx(TabPanel, { value: value, index: 3, children: _jsxs(ErrorBoundary, { children: [_jsxs(Stack, { spacing: 2, direction: "row", children: [_jsx(Typography, { variant: "h6", className: classes.rootHeading, children: "Stake TAO" }), _jsx(Button, { onClick: () => refreshMeta(), startIcon: _jsx(RefreshIcon, {}) })] }), _jsx(StakeTab, { delegateInfo: delegateInfo, stakeData: stakeData, loader: loader, refreshMeta: refreshMeta, delegatesExtras: delegatesExtras })] }) })] })] }));
};
export default NavTabs;
