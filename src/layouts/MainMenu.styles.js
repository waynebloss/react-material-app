import { makeStyles } from "@material-ui/core";

const drawerWidth = 250;

export const useStyles = makeStyles(
  theme => ({
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
    avatar: {
      margin: 16,
      marginTop: 32,
      padding: 24,
    },
    companyLogoShape: {
      position: "relative",
      left: "30%",
    },
    companyLogoBox: {
      position: "absolute",
      bottom: 0,
      textAlign: "center",
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
      "& img": {
        width: 140,
        paddingBottom: 10,
      },
    },
    drawer: {
      [theme.breakpoints.up("md")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      color: theme.palette.grey[700],
      width: drawerWidth,
      [theme.breakpoints.up("sm")]: {
        color: theme.palette.primary.contrastText,
        // backgroundColor: theme.palette.primary.dark,
        backgroundColor: "#004868",
      },
    },
    menuRoot: {
      backgroundColor: "#00364E",
      [theme.breakpoints.down("sm")]: {
        backgroundColor: "white",
      },
    },
    menuList: {
      backgroundColor: "#004868",
      [theme.breakpoints.down("sm")]: {
        backgroundColor: "white",
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    menuListItem: {
      color: "rgba(255, 255, 255, 0.38)",
      [theme.breakpoints.down("sm")]: {
        color: "rgba(0, 0, 0, 0.38)",
      },
    },
    menuListItemActive: {
      color: "white",
      borderLeft: "2px solid white",
      [theme.breakpoints.down("sm")]: {
        color: theme.palette.primary.light,
      },
    },
    menuListItemIcon: {
      color: "unset",
    },
    //
    // toolbar: theme.mixins.toolbar,
    //
    // CONSIDER: You can assign `theme.mixins.toolbar` as shown above and
    // then use it with a div to match the AppBar height, e.g.
    // <div className={classes.toolbar} />
    //
    userName: {
      marginBottom: -8,
      marginLeft: 16,
      marginTop: 0,
    },
    viewProfileText: {
      [theme.breakpoints.down("sm")]: {
        color: theme.palette.primary.main,
      },
    },
  }),
  {
    classNamePrefix: "MainMenu",
  },
);
