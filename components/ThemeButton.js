import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton, makeStyles } from "@material-ui/core";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import Brightness7Icon from "@material-ui/icons/Brightness7";
const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}));
const ThemeButton = ({ theme, ...props }) => {
    const classes = useStyles();
    return (_jsx(IconButton, { ...props, className: classes.root, children: theme ? _jsx(Brightness3Icon, {}) : _jsx(Brightness7Icon, {}) }));
};
export default ThemeButton;
