import React from "react";
import {
  AppBar,
  Dialog,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { CloseIcon } from "../../components";

const useStyles = makeStyles(
  theme => ({
    // appBar: {
    //   position: "relative",
    //   marginBottom: 20,
    // },
    closeIcon: {
      color: "rgba(0,0,0,0.6)",
      [theme.breakpoints.down("xs")]: {
        color: "white",
      },
    },
    content: {
      paddingBottom: 40,
      flex: 1,
      // height: "100%",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    titlebarLg: {
      display: "flex",
      flexDirection: "column",
    },
    titlebarLgBody: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
      marginTop: 60,
    },
    toolbarBottom: {
      backgroundColor: "#fafafa",
      paddingTop: 20,
      paddingBottom: 20,
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: theme.zIndex.mobileStepper,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  }),
  {
    classNamePrefix: "TestWizardDialogPage",
  },
);

function _TestWizardDialogPage({ handleCancel, title = "TEST DIALOG" }) {
  const classes = useStyles();
  return (
    <Dialog fullScreen open={true}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCancel}
            aria-label="close"
          >
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingTop: 75,
        }}
      >
        CONTENT
      </form>
    </Dialog>
  );
}

export const TestWizardDialogPage = React.memo(_TestWizardDialogPage);
