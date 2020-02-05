/**
 * @file This file is used to normalize environment variables and provide
 * intellisense/autocomplete for them. Import your settings from this file
 * instead of directly from `process.env`.
 */

/** Common environment names. */
const Environments = {
  development: "development",
  production: "production",
};

/** Name of the current environment. */
const NODE_ENV = process.env.NODE_ENV || Environments.development;
/** Host name used to detect production mode. */
const REACT_APP_PROD_HOSTNAME = process.env.REACT_APP_PROD_HOSTNAME;
/** True if the app is in development mode. */
const __DEV__ = NODE_ENV === Environments.development;
/**
 * True if the app is in production mode.
 * NOTE: We don't use Environments.production to test for this
 * because Create-React-App uses "production" for every other non-development
 * environment.
 */
const __PROD__ = window.location.hostname === REACT_APP_PROD_HOSTNAME;

/** Base URL of the API. */
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
/** URL to the company website. */
const REACT_APP_COMPANY_SITE_URL = process.env.REACT_APP_COMPANY_SITE_URL;
/** DSN URL for the error telemetry API. */
const REACT_APP_ERRORS_DSN = process.env.REACT_APP_ERRORS_DSN;
/** True to report errors during development. */
const REACT_APP_ERRORS_DEV = process.env.REACT_APP_ERRORS_DEV === "true";
/** Key to store redux state under localStorage. */
const REACT_APP_PERSIST_KEY = process.env.REACT_APP_PERSIST_KEY;
/** Site title string. */
const REACT_APP_SITE_TITLE = process.env.REACT_APP_SITE_TITLE;
/** Package version string from the package.json file. */
const REACT_APP_VERSION = process.env.REACT_APP_VERSION;

export {
  __DEV__,
  __PROD__,
  NODE_ENV,
  REACT_APP_API_URL,
  REACT_APP_COMPANY_SITE_URL,
  REACT_APP_ERRORS_DSN,
  REACT_APP_ERRORS_DEV,
  REACT_APP_PERSIST_KEY,
  REACT_APP_PROD_HOSTNAME,
  REACT_APP_SITE_TITLE,
  REACT_APP_VERSION,
};
