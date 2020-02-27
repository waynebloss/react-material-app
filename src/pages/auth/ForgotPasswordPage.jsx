import React from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
// Local
import { MuiPageLink } from "../../components";
import { useInputValue } from "../../lib";
import Pages from "../../pages";
import { AuthActions, useDispatch } from "../../state";
import { useMobile } from "../../themes";
import { useStyles } from "./ForgotPasswordPage.styles";

function _ForgotPasswordPage({
  pageRoute: {
    query: { expiredEmail = "" },
  },
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState(
    expiredEmail
      ? "Link expired. Please reset password again to continue."
      : "",
  );
  const [emailSent, setEmailSent] = React.useState(false);
  const [email, onChangeEmail] = useInputValue(expiredEmail);

  const isMobile = useMobile();

  /** @param {React.SyntheticEvent<HTMLButtonElement>} e */
  async function onClickSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    const result = await dispatch(AuthActions.forgotPassword({ email }));
    if (!result.error) {
      setEmailSent(true);
    } else {
      setErrorMessage("There was an error. Support has been notified.");
    }
  }
  return (
    <div className={classes.rootContainer}>
      <Typography variant="h5">Forgot password</Typography>
      {errorMessage ? (
        <Typography variant="subtitle1" className={classes.error}>
          {errorMessage}&nbsp;
        </Typography>
      ) : !emailSent ? (
        <React.Fragment>
          <Typography variant="subtitle1">
            Enter your email address and we will send you a link to reset your
            password.
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography variant="subtitle1">
            We sent you an email with a link and instructions to reset your
            password.
          </Typography>
          <Typography variant="subtitle1">
            Didn't receive the email? Check your spam folder or click below to
            send another one.
          </Typography>
        </React.Fragment>
      )}
      <form className="form" noValidate>
        {!emailSent && (
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus={!isMobile}
            value={email}
            onChange={onChangeEmail}
          />
        )}
        <div style={{ textAlign: "center" }}>
          <Button
            type="submit"
            fullWidth={isMobile}
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onClickSubmit}
            size="large"
          >
            {!emailSent ? "Reset Password" : "Resend Email"}
          </Button>
        </div>
        <Grid
          container
          alignItems="center"
          spacing={0}
          direction="column"
          justify="center"
        >
          <Grid item xs={12} className={classes.submitHelp}>
            <MuiPageLink
              to={Pages.auth.login}
              style={{ color: isMobile ? undefined : "#000000" }}
            >
              Back to sign in
            </MuiPageLink>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export const ForgotPasswordPage = React.memo(_ForgotPasswordPage);
