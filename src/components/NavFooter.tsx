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
            Donation address: 5EHVUNEqz1js5LdnW56hFpqKAV2pEGa7GCA2z6r7GVdLyTZE
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
        <Grid item>
        <span id="made-with-love">
          Made with &#10084;&#65039; in <a href="https://www.google.com/maps/place/Toronto,+ON/" target="_blank">Toronto</a>
        </span>
        </Grid>
      </Grid>
    </Typography>
  </Box>
)

export default AppFooter
