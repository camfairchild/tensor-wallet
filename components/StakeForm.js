import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useContext, useState, useEffect } from "react";
import { BN } from "@polkadot/util";
import { makeStyles, Typography, LinearProgress, Table, Box, TableBody, } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import { Keyring } from "@polkadot/keyring";
import { AccountContext } from "../utils/contexts";
import { ErrorBoundary, InputFunds } from ".";
import { useBalance, useApi, useLocalStorage } from "../hooks";
import { HistoryTableRow } from ".";
import { NETWORKS } from "../utils/constants";
import { web3FromAddress } from "@polkadot/extension-dapp";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
const useStyles = makeStyles((theme) => ({
    errorMessage: {
        marginBottom: theme.spacing(),
        textAlign: "center",
    },
    button: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        "&:hover": {
            color: theme.palette.getContrastText(theme.palette.secondary.dark),
        },
        display: "block",
        margin: "10px auto",
    },
    transferInfoMessage: {
        overflowWrap: "break-word",
        padding: "30px",
    },
    infoRow: {
        margin: "30px 0",
    },
    feePriceAndBalance: {
        height: "55px",
        display: "flex",
        margin: "0 auto",
        justifyContent: "center",
        alignItems: "baseline",
    },
    title: {
        paddingRight: "30px",
        opacity: 1,
    },
    priceBalance: {
        backgroundColor: "#E7FAEC",
    },
    priceFee: {
        backgroundColor: "#FFE0DC",
    },
    price: {
        padding: "0 10px",
        borderRadius: "2px",
        color: "#1E1E1E",
        fontWeight: 90,
        opacity: 1,
    },
    opacityNone: {
        opacity: 0,
    },
}));
const columns = [
    { id: "withWhom", label: "", width: 160 },
    { id: "extrinsic", label: "Extrinsic" },
    { id: "value", label: "Value", minWidth: 170, align: "right" },
    { id: "status", label: "Status", width: 40, align: "right" },
];
export default function StakeForm({ hotkeyAddr, stake, refreshStake }) {
    const classes = useStyles();
    const { account, setCurrentAccount } = useContext(AccountContext);
    const balanceArr = useBalance(account.accountAddress);
    const { api, network } = useApi();
    const maxAmountFull = balanceArr[1];
    const unit = balanceArr[3];
    // TODO: This must be prettier and reusable (exists already on App)
    const [endpoint, setEndpoint] = useLocalStorage("endpoint");
    if (!endpoint) {
        setEndpoint(Object.keys(NETWORKS[parseInt(network)])[0]);
    }
    // TODO END: This must be prettier and reusable (exists already on App)
    const [amount, setAmount] = useState("0");
    const [fundsIssueStake, setFundsIssueStake] = useState(false);
    const [fundsIssueUnstake, setFundsIssueUnstake] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [countdownNo, setCountdownNo] = useState(0);
    const [rowStatus, setRowStatus] = useState(0);
    const [txBlockHash, setTXBlockHash] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [showValue, setShowValue] = useState("");
    // AddStake=false, RemoveStake=true
    const [lastAction, setLastAction] = useState(false);
    const [lastAmount, setLastAmount] = useState("0");
    useEffect(() => {
        let countdown;
        if (!loading) {
            if (message !== "") {
                countdown = setInterval(() => {
                    setCountdownNo((oldCountdownNo) => {
                        if (oldCountdownNo === 0) {
                            setMessage("");
                            return 0;
                        }
                        else {
                            return oldCountdownNo - 1;
                        }
                    });
                }, 100);
            }
        }
        return () => {
            clearInterval(countdown);
        };
    }, [loading, message, setMessage]);
    const clearField = () => {
        setShowValue("");
    };
    const handleStake = async (e) => {
        e.preventDefault();
        const stakeAmount = amount;
        setLastAmount(stakeAmount);
        try {
            e.preventDefault();
            setLoading(true);
            setCountdownNo(100);
            setRowStatus(3);
            setTXBlockHash(null);
            const keyring = new Keyring({ type: "sr25519" });
            const sender = account.accountAddress;
            const injector = await web3FromAddress(sender);
            setLastAction(false);
            await api.tx.subtensorModule
                .addStake(hotkeyAddr, stakeAmount)
                .signAndSend(sender, { signer: injector.signer }, (result) => {
                setMessage(`Current transaction status ${result.status}`);
                if (result.status.isInBlock) {
                    clearField();
                    setCountdownNo(100);
                    setMessage(`Transaction Block hash: ${result.status.asInBlock}`);
                }
                else if (result.status.isFinalized) {
                    setRowStatus(1);
                    setCountdownNo(100);
                    setTXBlockHash(result.status.asFinalized);
                    setMessage(`Block hash:: ${result.status.asFinalized}.`);
                    account.userHistory.unshift({
                        withWhom: hotkeyAddr,
                        extrinsic: "AddStake",
                        value: stakeAmount,
                        status: 1,
                        blockHash: result.status.asFinalized
                    });
                    setCurrentAccount(account);
                }
            });
            setLoading(false);
            refreshStake(hotkeyAddr);
            setAmount("0");
        }
        catch (err) {
            setLoading(false);
            setRowStatus(2);
            setTXBlockHash(null);
            setMessage(`😞 Error: ${err}`);
            account.userHistory.unshift({
                withWhom: hotkeyAddr,
                extrinsic: "AddStake",
                value: stakeAmount,
                status: 2,
                blockHash: null
            });
            setCurrentAccount(account);
        }
    };
    const handleUnstake = async (e) => {
        e.preventDefault();
        const unstakeAmount = amount;
        setLastAmount(unstakeAmount);
        try {
            e.preventDefault();
            setLoading(true);
            setCountdownNo(100);
            setRowStatus(3);
            setLastAction(true);
            const keyring = new Keyring({ type: "sr25519" });
            const sender = account.accountAddress;
            const injector = await web3FromAddress(sender);
            await api.tx.subtensorModule
                .removeStake(hotkeyAddr, unstakeAmount)
                .signAndSend(sender, { signer: injector.signer }, (result) => {
                setMessage(`Current transaction status ${result.status}`);
                if (result.status.isInBlock) {
                    clearField();
                    setCountdownNo(100);
                    setMessage(`Transaction Block hash: ${result.status.asInBlock}`);
                }
                else if (result.status.isFinalized) {
                    setRowStatus(1);
                    setCountdownNo(100);
                    setTXBlockHash(result.status.asFinalized);
                    setMessage(`Block hash:: ${result.status.asFinalized}.`);
                    account.userHistory.unshift({
                        withWhom: hotkeyAddr,
                        extrinsic: "RemoveStake",
                        value: unstakeAmount,
                        status: 1,
                        blockHash: result.status.asFinalized
                    });
                    setCurrentAccount(account);
                }
            });
            setLoading(false);
            refreshStake(hotkeyAddr);
            setAmount("0");
        }
        catch (err) {
            setLoading(false);
            setRowStatus(2);
            setTXBlockHash(null);
            setMessage(`😞 Error: ${err}`);
            account.userHistory.unshift({
                withWhom: hotkeyAddr,
                extrinsic: "RemoveStake",
                value: unstakeAmount,
                status: 2,
                blockHash: null
            });
            setCurrentAccount(account);
        }
    };
    useEffect(() => {
        maxAmountFull &&
            amount &&
            setFundsIssueStake(new BN(maxAmountFull).sub(new BN(amount)).isNeg());
    }, [amount, maxAmountFull]);
    useEffect(() => {
        stake &&
            amount &&
            setFundsIssueUnstake(new BN(stake).sub(new BN(amount)).isNeg());
    }, [amount, stake]);
    useEffect(() => {
        if (!!amount && !parseInt(amount)) {
            setErrorMsg("Specify an amount");
        }
        else {
            setErrorMsg("");
        }
    }, [amount]);
    return (_jsxs(React.Fragment, { children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "flex-start", justifyContent: "center", children: [_jsx(ErrorBoundary, { children: _jsx(InputFunds, { hidePercentages: true, total: maxAmountFull, currency: unit, setAmount: setAmount, showValue: showValue, setShowValue: setShowValue }) }), _jsxs(ButtonGroup, { variant: "contained", "aria-label": "outlined primary button group", children: [_jsx(Button, { type: "submit", variant: "contained", size: "medium", color: "primary", disabled: loading ||
                                    !parseInt(amount) ||
                                    fundsIssueStake, onClick: handleStake, className: classes.button, children: "Stake" }), _jsx(Button, { type: "submit", variant: "contained", size: "medium", color: "primary", disabled: loading ||
                                    !parseInt(amount) ||
                                    fundsIssueUnstake, onClick: handleUnstake, className: classes.button, children: "Unstake" })] })] }), errorMsg && (_jsx(Typography, { variant: "body2", color: "error", className: classes.errorMessage, children: errorMsg })), message &&
                _jsxs(Box, { mt: 3, children: [countdownNo !== 0 && (_jsx(Table, { size: "small", children: _jsx(TableBody, { children: _jsx(HistoryTableRow, { row: {
                                        withWhom: hotkeyAddr,
                                        value: lastAmount,
                                        status: rowStatus,
                                        extrinsic: lastAction ? "RemoveStake" : "AddStake",
                                        blockHash: txBlockHash
                                    }, unit: unit, columns: columns }) }) })), _jsx(Typography, { variant: "subtitle2", className: classes.transferInfoMessage, children: message }), !loading && countdownNo !== 0 && (_jsx(LinearProgress, { variant: "determinate", value: countdownNo }))] })] }));
}
