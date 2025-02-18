import { FunctionComponent } from "react"

import { Box, Grid, Theme, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { NodeConnected } from "."

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(7),
    },
  },
}))

const Head: FunctionComponent = () => {
  const classes = useStyles()

  return (
    <Grid container alignItems="center" className={classes.root}>
      <Grid item xs={6}>
        <Box paddingX={2}>
          <Typography variant="h1" color="secondary" >Tensor Wallet</Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <NodeConnected />
      </Grid>
    </Grid>
  )
}

export default Head
