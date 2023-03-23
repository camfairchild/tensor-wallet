import { jsx as _jsx } from "react/jsx-runtime";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles({
    root: {
        display: "block",
        height: "5em",
        "& img": {
            maxHeight: "100%",
        },
    },
});
const Logo = ({ theme }) => {
    const classes = useStyles();
    return (_jsx("div", { className: classes.root, children: _jsx("img", { alt: "Tensor Wallet Logo", src: "./assets/images/logo_dark.svg" }) }));
};
export default Logo;
