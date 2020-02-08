import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import jwtDecode from "jwt-decode";
import { create as createJSS } from "jss";
import {
  CssBaseline,
  jssPreset,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFns from "@date-io/date-fns";
// Local
import { REACT_APP_SITE_TITLE } from "./config";
import { ErrorSentry } from "./components";
import { AppRouter, hasAuthRequestToken, setAuthRequestToken } from "./lib";
import { AppArea } from "./pages";
import { store } from "./state/store";

// Example to use service worker / progressive web app (PWA):
// import * as serviceWorker from "./serviceWorker";
// import serviceWorkerConfig from "./serviceWorkerConfig";

import { defaultTheme } from "./themes";
import "./assets/css/styles.css";

/**
 * Decoded authorization data.
 * @type {{userId:string, roles?:string[]}}
 */
let authTokenData;
/**
 * JSS config. Sets insertion point so JSS styles are inserted BEFORE our own,
 * so that we don't have to use `!important` everywhere to override JSS
 * generated styles.
 */
const jss = createJSS({
  ...jssPreset(),
  // See "Other HTML Element" at https://material-ui.com/styles/advanced/#insertionpoint
  insertionPoint: document.getElementById("jss-insertion-point"),
});

AppRouter.configure({
  loginCheck(page) {
    if (!hasAuthRequestToken()) {
      return false;
    }
    const { roles: pageRoles } = page;
    if (pageRoles) {
      const { roles: authRoles } = authTokenData;
      return authRoles && pageRoles.some(role => authRoles.includes(role));
    }
    return true;
  },
  loginPath: "/auth/login",
  loginRedirectParam: "after",
  pageOptions: {
    anon: false,
    pathExact: true,
  },
  rootArea: AppArea,
  configurePage(page) {
    // Save the old title in case it's needed elsewhere.
    page.titleText = page.title;
    // Normalize page titles so bookmarks don't have individual page titles.
    page.title = REACT_APP_SITE_TITLE; // `${page.title} - ${REACT_APP_SITE_TITLE}`;
  },
});
/**
 * Startup function.
 *
 * NOTE: The `store` already comes preloaded with data since `state/store.js`
 * does that.
 */
function main() {
  preloadAuthToken();
  render();
  registerServiceWorker();
}
/**
 * Loads the token from storage or redux and registers it with `AuthRequest`.
 */
function preloadAuthToken() {
  if (authTokenData) {
    return;
  }
  const state = store.getState();
  const {
    auth: { email, company = {}, user = {}, expiration, token } = {},
  } = state;
  if (token) {
    // NOTE: We only register telemetry user details here since the page reloads
    // after a login.
    ErrorSentry.setUser({
      email,
      id: `CompanyId=${company.id},UserId=${user.id}`,
      username: `${user.fName} ${user.lName}`,
    });
    authTokenData = jwtDecode(token);
    setAuthRequestToken(token, expiration);
  }
}
/**
 * Service worker registration.
 *
 * Should be registered after a call to `render` **UNLESS you are using
 * `self.clients.claim()` within your service worker.** Otherwise, you want
 * to register late (after a call to `render`) to avoid problems on "low-end
 * mobile devices" (per the docs).
 *
 * 1. [CRA docs on PWA](https://create-react-app.dev/docs/making-a-progressive-web-app)
 * 2. [Reasons to register early](https://developers.google.com/web/fundamentals/primers/service-workers/registration#reasons_to_register_early)
 *
 */
function registerServiceWorker() {
  // Example to implement register service worker:
  // serviceWorker.register(serviceWorkerConfig);
}

function render() {
  ReactDOM.render(
    <ErrorSentry>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <MuiPickersUtilsProvider utils={DateFns}>
            <ReduxProvider store={store}>
              <AppRouter />
            </ReduxProvider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </StylesProvider>
    </ErrorSentry>,
    document.getElementById("root"),
  );
}

main();
