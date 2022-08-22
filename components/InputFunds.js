import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { InputAdornment } from "@material-ui/core";
import { BN } from "@polkadot/util";
const InputFunds = ({ total, setAmount, currency, hidePercentages = false, setShowValue, showValue, }) => {
    const handleChange = (e, fromButtons = false) => {
        if (e.currentTarget.value?.length > 6)
            return;
        if (fromButtons) {
            const calcNewTotal = parseFloat(e.currentTarget.value) *
                parseInt(new BN(total).toString());
            const truncDec = Math.trunc(calcNewTotal);
            setShowValue(calcNewTotal.toString() !== ""
                ? (truncDec / Math.pow(10, 9)).toFixed(6)
                : "");
            setAmount(truncDec.toString());
            document.getElementById("SendFundsAmountField")?.focus();
        }
        else {
            const value = e.currentTarget.value;
            const v = parseFloat(value) * Math.pow(10, 9);
            setShowValue(value !== "" ? value : "");
            setAmount(value !== "" ? v.toString() : "0");
        }
    };
    // @TODO focus/blur TextField and %Buttons at the same time in a React way
    const [focus, setFocus] = useState(false);
    const handleFocus = () => {
        setFocus(!focus);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Box, { marginBottom: 1, children: _jsx(TextField, { id: "SendFundsAmountField", value: showValue, label: "Amount", fullWidth: true, type: "number", placeholder: "0", variant: "outlined", onChange: handleChange, onFocus: handleFocus, onBlur: handleFocus, InputProps: {
                        fullWidth: true,
                        startAdornment: (_jsx(InputAdornment, { position: "start", children: currency })),
                    } }) }), !hidePercentages && (_jsx(Grid, { container: true, spacing: 1, children: [
                    { label: "25%", value: 0.25 },
                    { label: "50%", value: 0.5 },
                    { label: "75%", value: 0.75 },
                    { label: "100%", value: 1 },
                ].map((item, index) => {
                    return (_jsx(Grid, { item: true, children: _jsx(Button, { onClick: (e) => handleChange(e, true), variant: "outlined", color: focus ? "primary" : undefined, size: "small", value: item.value, children: item.label }) }, index));
                }) }))] }));
};
export default InputFunds;
