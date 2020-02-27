import React from "react";
import {
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
// Local
import { MuiPageLink, VisibilityIcon } from "../../components";
import {
  hasAuthRequestToken,
  hasInvalidTokenError,
  Navigation,
  useInputValue,
  useOnMount,
} from "../../lib";
import Pages from "../../pages";
import { AuthActions, useDispatch } from "../../state";
import { useMobile } from "../../themes";
import { useStyles } from "./ResetPasswordPage.styles";

function _ResetPasswordPage({
  pageRoute: {
    location: { pathname },
    query: { email, token },
  },
}) {
  const dispatch = useDispatch();
  const confirming = Pages.auth.confirmAccount.path === pathname;
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [password1, onChangePassword1] = useInputValue("");
  const [password2, onChangePassword2] = useInputValue("");
  const [passwordInputType, setPasswordInputType] = React.useState("password");

  const isMobile = useMobile();

  /** @param {React.SyntheticEvent<HTMLButtonElement>} e */
  async function onClickSubmit(e) {
    e.preventDefault();

    if (password1.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!password1.match(/[A-Z]/g) || !password1.match(/[a-z]/g)) {
      setErrorMessage(
        "Password must contain uppercase and lowercase characters.",
      );
      return;
    }

    if (!password1.match(/[0-9]/g)) {
      setErrorMessage("Password must contain at least one digit.");
      return;
    }

    if (!password1.match(/[^a-zA-Z0-9\s]/g)) {
      setErrorMessage(
        "Password must contain at least one punctuation character.",
      );
      return;
    }
    if (password1 !== password2) {
      setErrorMessage("Passwords must match.");
      return;
    }
    setErrorMessage("");
    const doAction = confirming
      ? AuthActions.confirmAccount
      : AuthActions.resetPassword;
    const result = await dispatch(
      doAction({
        email,
        token,
        password1,
        password2,
      }),
    );
    if (!result.error) {
      Navigation.go(Pages.auth.login.path + "?reset=true");
    } else if (hasInvalidTokenError(result.error)) {
      if (confirming) {
        setErrorMessage(
          "Link expired. Please request another invitation to continue.",
        );
      } else {
        Navigation.go(
          Pages.auth.forgotPassword.path +
            "?expiredEmail=" +
            encodeURIComponent(email),
        );
      }
    } else {
      setErrorMessage("There was an error. Please try again.");
    }
  }

  function onClickTogglePassword(e) {
    e.preventDefault();
    setPasswordInputType(current => {
      return current === "password" ? "text" : "password";
    });
  }

  useOnMount(() => {
    // If the user clicked the invitation email just to get back to the app,
    // navigate to the home page for them...
    if (hasAuthRequestToken()) {
      window.location.replace("/");
    }
  });

  return (
    <div className={classes.rootContainer}>
      <Typography variant="h5">
        {confirming ? "New account sign up" : "Create new password"}
      </Typography>
      <p className={classes.error}>{errorMessage}</p>
      <Typography className={classes.help}>
        Passwords must be at least <strong>8 characters long</strong> and
        contain <strong>uppercase</strong> and <strong>lowercase</strong>{" "}
        characters, <strong>digits</strong> and <strong>punctuation</strong>{" "}
        characters.
        <br />
        <br />
        It's a good idea to use a strong password that you're not using
        elsewhere.
      </Typography>
      <form className="form" noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password1"
          label="Enter New Password"
          type="password"
          id="password1"
          autoComplete="new-password"
          value={password1}
          onChange={onChangePassword1}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password2"
          label="Reenter New Password"
          type={passwordInputType}
          id="password2"
          autoComplete="reenter-new-password"
          value={password2}
          onChange={onChangePassword2}
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
            onClick={onClickSubmit}
            size="large"
          >
            Reset Password
          </Button>
          <br />
          <br />
          <MuiPageLink
            to={Pages.auth.login}
            style={{ color: isMobile ? undefined : "#000000" }}
          >
            {confirming ? "Already signed up? " : "Already have a password? "}
            Login now.
          </MuiPageLink>
        </div>
      </form>
    </div>
  );
}

export const ResetPasswordPage = React.memo(_ResetPasswordPage);
