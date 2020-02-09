import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    title: {
      fontSize: 28,
      margin: 0,
      [theme.breakpoints.up("sm")]: {
        marginTop: 12,
      },
    },
    contentBox: {
      minHeight: 400,
      paddingTop: "15vh",
      textAlign: "center",
    },
  }),
  {
    classNamePrefix: "TodoPage",
  },
);
