import { FunctionComponent } from "react"
import { Button, makeStyles } from "@material-ui/core"

interface Props {
  theme: boolean,
  onClick: () => void
}

const useStyles = makeStyles({
  inner: {
    display: "block",
    height: "5em",
    "& img": {
      maxHeight: "100%",
    },
  },
  root: {
  }
})

const Logo: FunctionComponent<Props> = ({ theme, onClick }: Props) => {
  const classes = useStyles()
  return (
    <Button className={classes.root} onClick={onClick} title="Toggle Dark Theme">
      <div className={classes.inner}>
        <img
          alt="Tensor Wallet Logo"
          src={theme ? "./assets/images/logo_dark.svg" :
            "./assets/images/logo.png"
          } 
        />
      </div>
    </Button>
  )
}

export default Logo;
