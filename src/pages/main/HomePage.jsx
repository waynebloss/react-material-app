import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
// Local
import { connectView, uiLoading, userFirstName } from "../../state";
import { useMobile } from "../../themes";
import { useStyles } from "./HomePage.styles";

function _HomePage({
  // actions: { getHomePageData },
  userFirstName,
  uiLoading,
}) {
  const classes = useStyles();
  const isMobile = useMobile();

  // useOnMount(() => {
  //   getHomePageData();
  // });

  return (
    <Grid container spacing={isMobile ? 0 : 3}>
      <Grid item xs={12}>
        <Typography className={classes.title} variant="h4">
          Hey, {userFirstName}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box boxShadow={3} className={classes.contentBox}>
          HOME PAGE CONTENT
        </Box>
      </Grid>
    </Grid>
  );
}

export const HomePage = connectView(
  _HomePage,
  state => {
    return {
      ...userFirstName(state),
      ...uiLoading(state),
    };
  },
  // [HomePageActions],
);
