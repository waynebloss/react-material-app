import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    appBar: {
      position: "relative",
      marginBottom: 20,
    },
    closeIcon: {
      color: "rgba(0,0,0,0.6)",
      [theme.breakpoints.down("xs")]: {
        color: "white",
      },
    },
    content: {
      paddingBottom: 20,
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    titlebarLg: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
      marginTop: 20,
    },
  }),
  {
    classNamePrefix: "ModalDialog",
  },
);
