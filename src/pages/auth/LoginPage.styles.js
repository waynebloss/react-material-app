import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    rootContainer: {
      "& h5, h6": {
        marginTop: 20,
      },
    },
    error: {
      // backgroundColor: theme.palette.background.paper,
      color: theme.palette.error.main,
      fontWeight: "bold",
      textAlign: "center",
    },
    submit: {
      marginTop: 30,
      minWidth: 200,
    },
    submitHelp: {
      marginTop: 24,
      textAlign: "center",
    },
  }),
  {
    classNamePrefix: "LoginPage",
  },
);
