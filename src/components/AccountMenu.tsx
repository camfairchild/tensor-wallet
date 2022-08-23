import { useState, useContext, MouseEvent, useCallback } from "react"

import grey from "@mui/material/colors/grey"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Theme } from "@mui/material/styles/createTheme"

import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"

import { BurnrDivider } from "."

import { AccountContext } from "../utils/contexts"
import { openInNewTab } from "../utils/utils"
import { POLKA_ACCOUNT_ENDPOINTS } from "../utils/constants"

const { opentensorexplorer } = POLKA_ACCOUNT_ENDPOINTS

import type { InjectedAccountWithMeta, MetadataDef } from "@polkadot/extension-inject/types"
import useExtensions from "../hooks/useExtensions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
)

interface Props {
  accounts: InjectedAccountWithMeta[]
}

export default function AccountMenu({accounts}: Props) {
  const classes = useStyles()
  const [opentensorexplorerUri] = useState(`https://${opentensorexplorer}/#/explorer/`)
  const { setCurrentAccount } = useContext(AccountContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const [chainInfo, setChainInfo] = useState<MetadataDef>({} as MetadataDef)

  const { extensions } = useExtensions();

  const _updateMetadata = useCallback(
    (): void => {
      if (chainInfo && extensions?.length) {

        extensions.forEach((extension, index) => {
          extension
            .update(chainInfo)
            .catch(() => false)
            .catch(console.error);
        });
      }
    }, [chainInfo, extensions]
  );


  return (
    <>
      <IconButton onClick={handleClick}>
        <ExpandMoreIcon style={{ color: grey[500] }} />
      </IconButton>

      <Menu
        transformOrigin={{ vertical: -40, horizontal: "left" }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.menu}
      >
        <ListItem dense autoFocus={false} selected={false}>
          <Typography variant="overline">Block explorers</Typography>
        </ListItem>

        <MenuItem onClick={() => openInNewTab(opentensorexplorerUri)}>
          OpenTensor Fdn Explorer
        </MenuItem>

        <BurnrDivider />

        <ListItem dense autoFocus={false} selected={false}>
          <Typography variant="overline">Swtich Account</Typography>
        </ListItem>
        { accounts?.map(({ address, meta }, index) => (

          <MenuItem key={address} onClick={() => setCurrentAccount(
            {
              accountAddress: address,
              accountName: meta?.name || '',
              userHistory: [],
            }
          )}>
            { meta?.name || address.toString() }
          </MenuItem>
        ))}

        {/*<ListItem dense autoFocus={false} selected={false}>
          <Typography variant="overline">Networks</Typography>
        </ListItem>
        { NETWORKS.map(({ name }, index) => (

          <MenuItem key={name} onClick={() => setNetwork(index.toString())}>
            { name }
          </MenuItem>
        ))}*/}
      {/*
        <ListItem dense autoFocus={false} selected={false}>
          <Typography variant="overline">Update Metadata</Typography>
        </ListItem>
        <MenuItem onClick={() => _updateMetadata()}>
          Update
        </MenuItem>
      */}
        
      </Menu>
    </>
  )
}
