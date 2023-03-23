import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, } from "react";
import Box from "@mui/material/Box";
import CurrencyInput from 'react-currency-input-field';
const InputFunds = ({ total, setAmount, currency }) => {
    const handleChange = (value) => {
        if (value === "" || value === undefined) {
            setAmount("0");
            return;
        }
        let v = parseFloat(value);
        v = v * 1e9; // convert to rao
        setAmount(Math.trunc(v).toString());
    };
    // @TODO focus/blur TextField and %Buttons at the same time in a React way
    const [focus, setFocus] = useState(false);
    const handleFocus = () => {
        setFocus(!focus);
    };
    return (_jsx(_Fragment, { children: _jsx(Box, { children: _jsx(CurrencyInput, { style: styles.input, id: "SendFundsAmountField", name: "input-name", placeholder: "0", defaultValue: 0.0, decimalsLimit: 9, onValueChange: (value, name) => handleChange(value), allowNegativeValue: false, suffix: ` ${currency}`, step: 1e-9 }) }) }));
};
const styles = {
    input: {
        width: "100%",
        height: "55px",
        fontSize: "24px",
        padding: "0 10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
    },
};
export default InputFunds;
