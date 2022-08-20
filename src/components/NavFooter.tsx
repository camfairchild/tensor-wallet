import { FunctionComponent } from "react"

import { Typography, Box, Link, Grid } from "@material-ui/core"

const AppFooter: FunctionComponent = () => (
  <Box paddingBottom={2}>
    <Typography variant="body2" component="div">
      <Grid container spacing={1}>
        <Grid item>
          <Link
            href="https://fairchild.dev/"
            underline="hover"
            color="textPrimary"
          >
            © {new Date().getFullYear()} Cameron Fairchild
          </Link>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="textPrimary">
            Donation address: 5CSWAPCCDxAtjV2vy38VSNYchQWCsiWA9pW6yZCydQ7dGyYC
          </Typography>
        </Grid>
        <Grid item>
          <Link
            href="https://github.com/camfairchild/tensor-wallet/issues"
            underline="hover"
            target="_blank"
            rel="noreferrer"
            color="textPrimary"
          >
            Report an issue
          </Link>
        </Grid>
      </Grid>
    </Typography>
  </Box>
)

export default AppFooter
