import { useState, useContext, MouseEvent, useCallback } from "react"

import grey from "@mui/material/colors/grey"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Theme } from "@mui/material/styles/createTheme"

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import { BurnrDivider } from "."

import { AccountContext } from "../utils/contexts"
import { openInNewTab } from "../utils/utils"
import { POLKA_ACCOUNT_ENDPOINTS } from "../utils/constants"

const { polkadotjsexplorer, scantensor, taostats } = POLKA_ACCOUNT_ENDPOINTS

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
  const polkadotjsexplorerUri = `https://${polkadotjsexplorer}#/explorer/`
  const { setCurrentAccount } = useContext(AccountContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const [chainInfo, setChainInfo] = useState<MetadataDef>({} as MetadataDef)

  /*const { extensions } = useExtensions();

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
  );*/


  return (<>
    <IconButton onClick={handleClick} size="large">
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
      <ListItem dense autoFocus={false} component="div">
        <Typography variant="overline">Block explorers</Typography>
      </ListItem>

      <MenuItem onClick={() => openInNewTab(polkadotjsexplorerUri)}>
        PolkadotJS Explorer
      </MenuItem>

      <MenuItem onClick={() => openInNewTab(scantensor)}>
        ScanTensor Explorer
      </MenuItem>

      <MenuItem onClick={() => openInNewTab(taostats)}>
        TAOStats Explorer
      </MenuItem>

      <BurnrDivider />

      <ListItem dense autoFocus={false} component="div">
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
      
    </Menu>
  </>);
}
