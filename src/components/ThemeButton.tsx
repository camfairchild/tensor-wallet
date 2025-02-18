import { FunctionComponent } from "react"

import { IconButton, IconButtonProps } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import Brightness3Icon from "@mui/icons-material/Brightness3"
import Brightness7Icon from "@mui/icons-material/Brightness7"

interface Props extends IconButtonProps {
  theme: boolean
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
  },
}))

const ThemeButton: FunctionComponent<Props> = ({ theme, ...props }: Props) => {
  const classes = useStyles()
  return (
    (<IconButton {...props} className={classes.root} size="large">
      {theme ? <Brightness3Icon /> : <Brightness7Icon />}
    </IconButton>)
  );
}

export default ThemeButton
