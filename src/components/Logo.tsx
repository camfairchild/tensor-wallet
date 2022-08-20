import { FunctionComponent } from "react"
import { makeStyles } from "@material-ui/core"

interface Props {
  theme: boolean
}

const useStyles = makeStyles({
  root: {
    display: "block",
    height: "5em",
    "& img": {
      maxHeight: "100%",
    },
  },
})

const Logo: FunctionComponent<Props> = ({ theme }: Props) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <img
        alt="Tensor Wallet Logo"
        src="./assets/images/logo.png"
      />
    </div>
  )
}

export default Logo;
