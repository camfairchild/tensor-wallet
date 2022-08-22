import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useContext, useCallback } from "react";
import grey from "@mui/material/colors/grey";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { BurnrDivider } from ".";
import { AccountContext } from "../utils/contexts";
import { openInNewTab } from "../utils/utils";
import { POLKA_ACCOUNT_ENDPOINTS } from "../utils/constants";
const { opentensorexplorer } = POLKA_ACCOUNT_ENDPOINTS;
import useExtensions from "../hooks/useExtensions";
const useStyles = makeStyles((theme) => createStyles({
    menu: {
        "& .MuiListItem-dense:focus": {
            outline: "transparent !important",
        },
        "& hr": {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            backgroundColor: theme.palette.grey[200],
        },
    },
}));
export default function AccountMenu({ accounts }) {
    const classes = useStyles();
    const [opentensorexplorerUri] = useState(`https://${opentensorexplorer}/#/explorer/`);
    const { setCurrentAccount } = useContext(AccountContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const [chainInfo, setChainInfo] = useState({});
    const { extensions } = useExtensions();
    const _updateMetadata = useCallback(() => {
        if (chainInfo && extensions?.length) {
            extensions.forEach((extension, index) => {
                extension
                    .update(chainInfo)
                    .catch(() => false)
                    .catch(console.error);
            });
        }
    }, [chainInfo, extensions]);
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, { onClick: handleClick, children: _jsx(ExpandMoreIcon, { style: { color: grey[500] } }) }), _jsxs(Menu, { transformOrigin: { vertical: -40, horizontal: "left" }, anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: () => setAnchorEl(null), className: classes.menu, children: [_jsx(ListItem, { dense: true, autoFocus: false, selected: false, children: _jsx(Typography, { variant: "overline", children: "Block explorers" }) }), _jsx(MenuItem, { onClick: () => openInNewTab(opentensorexplorerUri), children: "OpenTensor Fdn Explorer" }), _jsx(BurnrDivider, {}), _jsx(ListItem, { dense: true, autoFocus: false, selected: false, children: _jsx(Typography, { variant: "overline", children: "Swtich Account" }) }), accounts?.map(({ address, meta }, index) => (_jsx(MenuItem, { onClick: () => setCurrentAccount({
                            accountAddress: address,
                            accountName: meta?.name || '',
                            userHistory: [],
                        }), children: meta?.name || address.toString() }, address))), _jsx(ListItem, { dense: true, autoFocus: false, selected: false, children: _jsx(Typography, { variant: "overline", children: "Update Metadata" }) }), _jsx(MenuItem, { onClick: () => _updateMetadata(), children: "Update" })] })] }));
}
