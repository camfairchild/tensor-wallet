import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { IconButton, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import CachedIcon from "@material-ui/icons/Cached";
import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";
const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: "none",
    },
    paper: {
        padding: theme.spacing(1),
        marginTop: theme.spacing(-0.5),
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}));
const PopoverExtrinsic = ({ status, }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (_jsxs(_Fragment, { children: [_jsxs(IconButton, { onMouseEnter: handlePopoverOpen, onMouseLeave: handlePopoverClose, children: [status === 0 && _jsx(CachedIcon, { color: "disabled" }), status === 1 && _jsx(CheckIcon, { color: "action" }), status === 2 && _jsx(ErrorIcon, { color: "error" }), status === 3 && _jsx(CircularProgress, {})] }), _jsx(Popover, { elevation: 2, transitionDuration: 0, id: "mouse-over-popover", className: classes.popover, classes: {
                    paper: classes.paper,
                }, open: open, anchorEl: anchorEl, anchorOrigin: {
                    vertical: "top",
                    horizontal: "center",
                }, transformOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                }, onClose: handlePopoverClose, disableRestoreFocus: true, children: _jsx(Typography, { variant: "body2", children: "The content of the Popover, link to BlockExplorers" }) })] }));
};
export default PopoverExtrinsic;
