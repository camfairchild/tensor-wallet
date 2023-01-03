import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useContext, useState, useEffect, } from "react";
import { BN } from "@polkadot/util";
import { makeStyles, Button, Typography, LinearProgress, Table, Grid, Box, } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import { Keyring } from "@polkadot/keyring";
import { AccountContext } from "../utils/contexts";
import { InputAddress, InputFunds } from ".";
import { useBalance, useApi, useLocalStorage } from "../hooks";
import { HistoryTableRow } from ".";
import { isValidAddressPolkadotAddress, prettyBalance } from "../utils/utils";
import { NETWORKS } from "../utils/constants";
import { web3FromAddress } from "@polkadot/extension-dapp";
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
const Structure = ({ name, rest, fee }) => {
    const { feePriceAndBalance, opacityNone, title, price, priceBalance, priceFee, } = useStyles();
    return (_jsxs("div", { className: feePriceAndBalance, children: [_jsx("div", { className: !fee ? opacityNone : title, children: name }), _jsx("div", { className: !fee
                    ? opacityNone
                    : name === "Fees"
                        ? `${price} ${priceFee}`
                        : `${price} ${priceBalance}`, children: _jsx(Typography, { variant: "subtitle1", children: rest }) })] }));
};
const SendFundsForm = () => {
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
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("0");
    const [fundsIssue, setFundsIssue] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [countdownNo, setCountdownNo] = useState(0);
    const [rowStatus, setRowStatus] = useState(0);
    const [txBlockHash, setTXBlockHash] = useState(null);
    const [fee, setFee] = useState();
    const [errorMsg, setErrorMsg] = useState("");
    const [showValue, setShowValue] = useState("");
    const clearAmount = () => {
        setAmount("0");
        setShowValue("");
    };
    useEffect(() => {
        const calcFee = async () => {
            const fee = await api.tx.balances
                .transfer(address, new BN(amount))
                .paymentInfo(account.accountAddress);
            setFee(fee.partialFee);
        };
        !amount ||
            amount === "0" ||
            !isValidAddressPolkadotAddress(address) ||
            !account.accountAddress
            ? setFee(undefined)
            : void calcFee();
    }, [amount, account.accountAddress, address, api.tx.balances]);
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
    const handleSubmit = async (e) => {
        const transferAmount = amount;
        try {
            e.preventDefault();
            setLoading(true);
            setCountdownNo(200);
            setRowStatus(3);
            setTXBlockHash(null);
            const keyring = new Keyring({ type: "sr25519" });
            const sender = account.accountAddress;
            const injector = await web3FromAddress(sender);
            await api.tx.balances
                .transfer(address, new BN(transferAmount))
                .signAndSend(sender, { signer: injector.signer }, (result) => {
                setMessage(`Current transaction status ${result.status}`);
                if (result.status.isInBlock) {
                    clearAmount();
                    setCountdownNo(100);
                    setMessage(`Transaction Block hash: ${result.status.asInBlock}`);
                }
                else if (result.status.isFinalized) {
                    setRowStatus(1);
                    setCountdownNo(100);
                    setTXBlockHash(result.status.asFinalized);
                    setMessage(`Block hash:: ${result.status.asFinalized}.`);
                    account.userHistory.unshift({
                        withWhom: address,
                        extrinsic: "Transfer",
                        value: transferAmount,
                        status: 1,
                        blockHash: result.status.asFinalized
                    });
                    setCurrentAccount(account);
                }
            });
            setLoading(false);
        }
        catch (err) {
            setLoading(false);
            setRowStatus(2);
            setTXBlockHash(null);
            setMessage(`😞 Error: ${err}`);
            account.userHistory.unshift({
                withWhom: address,
                extrinsic: "Transfer",
                value: transferAmount,
                status: 2,
                blockHash: null
            });
            setCurrentAccount(account);
        }
    };
    useEffect(() => {
        maxAmountFull &&
            amount &&
            fee &&
            setFundsIssue(new BN(maxAmountFull).sub(new BN(amount)).sub(fee).isNeg());
    }, [amount, fee, maxAmountFull]);
    useEffect(() => {
        if (!!address && !isValidAddressPolkadotAddress(address)) {
            setErrorMsg("Invalid Destination address");
        }
        else if (fundsIssue) {
            setErrorMsg("Insufficient funds");
        }
        else {
            setErrorMsg("");
        }
    }, [address, amount, fundsIssue]);
    return (_jsxs(React.Fragment, { children: [_jsxs(Stack, { direction: "column", spacing: 2, children: [_jsx(InputAddress, { setAddress: setAddress }), _jsx(InputFunds, { hidePercentages: true, total: maxAmountFull, currency: unit, setAmount: setAmount, showValue: showValue, setShowValue: setShowValue })] }), _jsxs(Grid, { item: true, xs: 12, className: classes.infoRow, children: [_jsx(Structure, { fee: fee, name: "Fees", rest: fee ? `${prettyBalance(fee)} ${unit}` : "" }), _jsx(Structure, { fee: fee, name: "Balance after transaction", rest: fee
                            ? `${prettyBalance(new BN(maxAmountFull).sub(new BN(amount)).sub(fee))} ${unit}`
                            : "" })] }), _jsx(Button, { type: "submit", variant: "contained", size: "large", color: "secondary", disabled: loading ||
                    !parseInt(amount) ||
                    !isValidAddressPolkadotAddress(address) ||
                    account.accountAddress === address ||
                    fundsIssue, onClick: handleSubmit, className: classes.button, children: "Send" }), errorMsg && (_jsx(Typography, { variant: "body2", color: "error", className: classes.errorMessage, children: errorMsg })), _jsxs(Box, { mt: 3, children: [countdownNo !== 0 && (_jsx(Table, { size: "small", children: _jsx(HistoryTableRow, { row: {
                                withWhom: address,
                                extrinsic: "Transfer",
                                value: amount,
                                status: rowStatus,
                                blockHash: txBlockHash
                            }, unit: unit, columns: columns }) })), _jsx(Typography, { variant: "subtitle2", className: classes.transferInfoMessage, children: message }), !loading && countdownNo !== 0 && (_jsx(LinearProgress, { variant: "determinate", value: countdownNo }))] })] }));
};
export default SendFundsForm;
