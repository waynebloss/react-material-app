import { makeStyles } from "@material-ui/core";
// import desktopBg from "../assets/img/sidebar-bg_500x850.jpg";

export const useStyles = makeStyles(
  theme => ({
    baseContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#0B79A2",
      [theme.breakpoints.up("sm")]: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
      },
    },
    desktopContainer: {
      display: "flex",
    },
    desktopSidebar: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        backgroundColor: "#0B79A2",
        display: "block",
        flex: "0 0 auto",
        width: "30vw",

        // Example: Add sidebar background image instead of backgroundColor:
        // backgroundImage: `url(${desktopBg})`,
        // backgroundSize: "cover",
        // paddingLeft: "3.5%",
        // paddingTop: 50,
      },
    },
    content: {
      flexGrow: 1,
    },
    footerBox: {
      color: "grey",
      textAlign: "center",
      width: "100%",
      [theme.breakpoints.down("xs")]: {
        color: "lightgrey",
      },
    },
    logoBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "30vh",
      justifyContent: "center",
      backgroundColor: theme.palette.background.paper,
      marginLeft: -16,
      marginRight: -16,

      [theme.breakpoints.up("sm")]: {
        visibility: "hidden",
      },
    },
  }),
  {
    classNamePrefix: "AuthAreaLayout",
  },
);
