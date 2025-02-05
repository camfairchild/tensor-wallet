import { useState, useEffect, ReactElement } from "react"

import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import { Typography, Box } from "@mui/material"
import { ApiPromise } from "@polkadot/api/promise/Api"

import { NETWORKS, BURNR_WALLET } from "../utils/constants"
import { useApi } from "../hooks"
import { logger } from "@polkadot/util"

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import Stack from "@mui/material/Stack"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nodeSelectorWrap: {
      position: "relative",
      minHeight: "50px",
      maxHeight: "90px",
      padding: theme.spacing(0.25),
      paddingLeft: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      borderTopLeftRadius: theme.spacing(0.5),
      backgroundColor: theme.palette.background.paper,
      border: "2px solid",
      borderColor: 'grey',
      borderBottom: "none"
    },
    nodeSelectorInner: {
      position: "relative",
      zIndex: theme.zIndex.modal,
      width: "100%",
      borderRadius: theme.spacing(0.5),
      backgroundColor: theme.palette.background.paper,
      "&.open": {
        boxShadow: theme.shadows[2],
      },
    },
    nodeDesc: {
      color: theme.palette.text.secondary,
    },
    networkName: {
      color: theme.palette.text.secondary,
    }
  }),
)

export interface Option {
  network: string
  client: string | undefined
  provider: string
}

type colorType =
  | "inherit"
  | "primary"
  | "secondary"
  | "action"
  | "disabled"
  | "error"

export default function NodeConnected(): ReactElement {
  const l = logger(BURNR_WALLET)
  const classes = useStyles()
  
  const [fiberColor, setFiberColor] = useState<colorType>("error")
  const { api, network  } = useApi()

  useEffect(() => {
    const getColor = async (api: ApiPromise) => {
      if (api && (await api.isReady)) {
        setFiberColor("primary")
        l.log("TensorWallet is now connected to", NETWORKS[parseInt(network)].name)
      }
    }

    api && getColor(api)
  }, [api, l])

  return (
    <Box className={classes.nodeSelectorWrap}>
      <Box className={classes.nodeSelectorInner}>
        <Stack
          alignItems="flex-start"
          direction="column"
        >
          <FiberManualRecordIcon
            style={{ fontSize: "16px", marginRight: 4 }}
            color={fiberColor}
          />
          <Stack width="100%" alignItems="baseline" direction="column" >
            <Typography variant="h4" className={classes.networkName} >{NETWORKS[parseInt(network)].name}</Typography>
            <Typography
              variant="body2"
              className={classes.nodeDesc}
            >
              {NETWORKS[parseInt(network)].client}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
