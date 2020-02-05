import React from "react";
import {
  init,
  configureScope,
  withScope,
  captureException,
  showReportDialog,
} from "@sentry/browser";

import {
  __DEV__,
  NODE_ENV,
  REACT_APP_ERRORS_DEV,
  REACT_APP_ERRORS_DSN,
  REACT_APP_VERSION,
} from "../../config";

const usingDevConfig = __DEV__ && !REACT_APP_ERRORS_DEV;

const devConfig = usingDevConfig
  ? {
      beforeSend() {
        // Do not send errors in development.
        return null;
      },
    }
  : undefined;

if (__DEV__ && !usingDevConfig) {
  console.warn("Reporting errors to https://sentry.io during development.");
}

/** See https://docs.sentry.io/learn/configuration */
init({
  /** Where to send errors. This is NOT a secret. */
  dsn: REACT_APP_ERRORS_DSN,
  environment: NODE_ENV,
  release: REACT_APP_VERSION,
  ...devConfig,
});

let reportDialogUser;

/**
 * Error boundary component that reports errors to https://sentry.io
 * NOTE: You don't _need_ to render this error boundary to report errors.
 * Error boundaries are primarily for catching React _rendering_ errors and
 * showing an error result UI.
 */
export class ErrorSentry extends React.Component {
  state = { error: null };

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      captureException(error);
    });
    showReportDialog({
      user: reportDialogUser,
    });
  }

  render() {
    if (this.state.error) {
      // TODO: Render fallback error prop or place better error UI here...
      return (
        <a href="/" onClick={this.showReportDialog}>
          An error has occurred. Click here to report feedback.
        </a>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }

  showReportDialog = e => {
    e.preventDefault();
    showReportDialog();
  };

  /** @param {import("@sentry/browser").User} user */
  static setUser(user) {
    if (__DEV__ && !usingDevConfig) {
      console.log("ErrorSent.setUser: ", user);
    }
    reportDialogUser = {
      name: user.username,
      email: user.email,
    };
    configureScope(scope => {
      scope.setUser(user);
    });
  }
}
