import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, memo, } from "react";
import { FormControl, TextField, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Identicon from "@polkadot/react-identicon";
const InputAddress = ({ setAddress }) => {
    const [value, setValue] = useState("");
    useEffect(() => {
        setAddress(value);
    }, [value, setAddress]);
    const handleChangeButton = (e) => {
        const val = e.currentTarget.value;
        setValue(val);
    };
    return (_jsx(_Fragment, { children: _jsx(Box, { marginY: 1, children: _jsx(FormControl, { required: true, fullWidth: true, children: _jsx(TextField, { label: "Receiver", onChange: handleChangeButton, onFocus: handleChangeButton, onBlur: handleChangeButton, value: value, placeholder: "Bittensor Address", variant: "outlined", fullWidth: true, InputProps: {
                        spellCheck: "false",
                        startAdornment: (_jsx(Box, { marginRight: 1, children: !value || value === "" ? (_jsx(Skeleton, { variant: "circle", width: 32, height: 32 })) : (_jsx(Identicon, { size: 32, theme: "polkadot", value: value })) })),
                    } }) }) }) }));
};
export default memo(InputAddress);
