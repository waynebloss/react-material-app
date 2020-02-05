import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    menuContainer: {
      display: "flex",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexGrow: 1,
      paddingBottom: 100,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        marginTop: 80,
      },
    },
    installNotice: {
      alignText: "center",
      paddingTop: 100,
      paddingBottom: 20,
    },
    loadingBackdrop: {
      backgroundColor: "transparent",
      zIndex: theme.zIndex.modal + 100,
    },
    notificationUI: {
      top: 120,
      [theme.breakpoints.up("xs")]: {
        top: 60,
      },
    },
  }),
  {
    classNamePrefix: "MainLayout",
  },
);
