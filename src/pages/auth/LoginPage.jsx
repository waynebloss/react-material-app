import React from "react";
import {
  Button,
  CircularProgress,
  Grid,
  // IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
// Local
import {
  AlternateEmailIcon,
  MuiPageLink,
  VisibilityIcon,
} from "../../components";
import { hasAuthRequestToken, useInputValue, useOnMount } from "../../lib";
import { connectView, AuthActions, uiLoading } from "../../state";
import Pages from "../../pages";
import { useMobile } from "../../themes";
import { useStyles } from "./LoginPage.styles";

function _LoginPage({
  actions: { login },
  pageRoute: {
    query: { after: navigateAfterLoginURL, reset },
  },
  uiLoading,
}) {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [email, onChangeEmail] = useInputValue();
  const [password, onChangePassword] = useInputValue();
  const [passwordInputType, setPasswordInputType] = React.useState("password");

  const isMobile = useMobile();

  let titleText = "Welcome";
  let subtitleText = (
    <>
      Enter your details below.
      <br />
      Any credentials that follow the validation rules will work in this demo.
    </>
  );
  if (reset) {
    titleText = "Your password was reset!";
    subtitleText = "Sign in again and you're good to go.";
  }

  function navigateAfterLogin() {
    if (navigateAfterLoginURL) {
      window.location.replace(navigateAfterLoginURL);
    } else {
      window.location.replace("/");
    }
  }

  /** @param {React.SyntheticEvent<HTMLButtonElement>} e */
  async function onClickLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    const result = await login({ email, password });
    if (!result.error) {
      navigateAfterLogin();
    } else {
      setErrorMessage("Incorrect email or password.");
    }
  }

  function onClickTogglePassword(e) {
    e.preventDefault();
    setPasswordInputType(current => {
      return current === "password" ? "text" : "password";
    });
  }

  useOnMount(() => {
    if (hasAuthRequestToken()) {
      navigateAfterLogin();
    }
  });

  return (
    <div className={classes.rootContainer}>
      <Typography variant="h5">{titleText}</Typography>
      {errorMessage ? (
        <Typography variant="subtitle1" className={classes.error}>
          {errorMessage}&nbsp;
        </Typography>
      ) : (
        <Typography variant="subtitle1">{subtitleText}&nbsp;</Typography>
      )}
      <form className="form" noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          autoFocus={!isMobile}
          value={email}
          onChange={onChangeEmail}
          disabled={uiLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AlternateEmailIcon
                  style={{ color: isMobile ? "#0B79A2" : "white" }}
                />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={passwordInputType}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={onChangePassword}
          disabled={uiLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <VisibilityIcon
                  onClick={onClickTogglePassword}
                  style={{
                    cursor: "pointer",
                    color: isMobile
                      ? "rgba(255,255,255,0.38)"
                      : "rgba(0,0,0,0.38)",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
        <div style={{ textAlign: "center" }}>
          <Button
            type="submit"
            fullWidth={isMobile}
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onClickLogin}
            disabled={uiLoading}
            size="large"
          >
            Sign In
          </Button>
        </div>
        <Grid container>
          <Grid item xs={12} className={classes.submitHelp}>
            {uiLoading ? (
              <CircularProgress size={24} />
            ) : (
              <MuiPageLink
                to={Pages.auth.forgotPassword}
                style={{ color: isMobile ? undefined : "#000000" }}
              >
                Forgot password?
              </MuiPageLink>
            )}
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export const LoginPage = connectView(_LoginPage, uiLoading, [AuthActions]);
