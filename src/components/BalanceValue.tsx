import { FunctionComponent, memo } from "react"

import { makeStyles, Theme } from "@material-ui/core/styles"
import { Box, Typography } from "@material-ui/core"
import { SizeScale } from "../utils/types"
import { prettyBalance } from "../utils/utils"
import { CSSProperties } from "@material-ui/core/styles/withStyles"
import { Balance } from "@polkadot/types/interfaces"
import { bnToBn } from "@polkadot/util"
import { useApi } from "../hooks"

interface Props extends SizeScale {
  value: Balance
  isVisible: boolean
  unit?: string
  style?: CSSProperties
  colored?: boolean
}
interface StyleProps {
  colored?: boolean
  visible?: boolean
}

// @TODO get token codes from api
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "inline-flex",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  colored: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  blur: {
    filter: "blur(5px)"
  },
  unblur: {
    filter: "unset"
  },
  balance: {
    width: "max-content",
  }
}))

const BalanceValue: FunctionComponent<Props> = ({
  value,
  isVisible,
  unit = "TAO",
  size,
  style,
  colored = false,
}: Props) => {
  const apiCtx = useApi()
  const value_bn = bnToBn(value)
  const fBalance = prettyBalance(value_bn, apiCtx.api)
  const classes = useStyles({ colored, visible: isVisible })

  const TypographyVariant = size === "large" ? "subtitle1" : "subtitle2"
  return (
    <Box component="span" className={`${classes.root} ${colored ? classes.colored : ""}`} style={style}>
      <Typography variant={TypographyVariant} className={`${classes.balance} ${isVisible ? classes.unblur : classes.blur}`}>
        {`${fBalance} ${unit}`}
      </Typography>
    </Box>
  )
}

export default memo(BalanceValue)
