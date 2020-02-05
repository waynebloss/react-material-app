import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    rootContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& h5": {
        alignSelf: "start",
        marginTop: 20,
      },
    },
    error: {
      color: "maroon",
      fontWeight: "bold",
    },

    help: {
      margin: 4,
      marginTop: 20,
    },

    submit: {
      marginTop: 30,
      marginBottom: 13,
      minWidth: 200,
    },
    textCenter: {
      textAlign: "center",
    },
  }),
  {
    classNamePrefix: "ResetPasswordPage",
  },
);
