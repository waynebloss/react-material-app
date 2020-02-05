import axios from "axios";
import qs from "query-string";
import { lowerCamelCase } from "./utils";
import { logError } from "./logging";

const {
  /** The base URL for the API. */
  REACT_APP_API_URL,
  NODE_ENV,
} = process.env;

const IS_DEV = NODE_ENV === "development";

/** Token to apply to each request. */
let authToken;
let authExpirationDate;

/** Id of the interceptor used to apply auth headers. */
let authInterceptorId;

/** Axios instance to use for authenticated requests. */
export const AuthRequest = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});
/** Performs a `DELETE` with authorization.
 * @param {string | [string, any]} url
 * @param {AuthCallOptions} [opt]
 * @returns {Promise<AxiosAuthResponse>} */
export async function authDelete(url, opt) {
  opt = normalizeCallOptions(opt);
  const nurl = normalizeURL(url);
  return AuthRequest.delete(nurl)
    .catch(errorHandler("DELETE", nurl, opt))
    .then(opt.callback);
}
/**
 * Performs a GET with authorization, to download a binary blob.
 * @param {string | [string, any]} url
 * @param {AuthCallOptions} [opt]
 * @returns {Promise<AxiosAuthResponse>} */
export async function authDownload(url, opt) {
  opt = normalizeCallOptions(opt, { config: { responseType: "blob" } });
  const response = await authGet(url, opt);
  if (response.error) {
    return response;
  }
  const blob = new Blob([response.data], { type: response.data.type });
  const href = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  let fileName = response.headers["x-filename"] || "File";
  // #region TODO
  //
  // TODO: This download method didn't work in Safari on iOS.
  //
  // TODO: Is the Content-Disposition sent from the server correct?
  //
  // There are 2 filename attributes and it seems weird and the filename
  // parsing regex found here didn't work like it did for everyone else
  // - https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743#gistcomment-2677506
  //
  // Example "Content-Disposition":
  //  "attachment; filename=Document_2018-10-04.pdf; filename*=UTF-8''Document_2018-10-04.pdf"
  //
  // While the following code gets filename, it was only tested in Chrome.
  // So, for now, I made the server add the X-Filename header to bypass any
  // complexity with parsing Content-Disposition.
  //
  // console.log("DOWNLOAD HEADERS: ", response.headers);
  // const contentDisposition = response.headers["content-disposition"];
  // if (contentDisposition) {
  //   const fileNameMatch = contentDisposition.match(/filename=(.+);/);
  //   if (fileNameMatch.length === 2) {
  //     fileName = fileNameMatch[1];
  //   }
  // }
  // #endregion
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  // NOTE: Calling `link.click()` opens the browsers file-save dialog.
  link.click();
  link.remove();
  window.URL.revokeObjectURL(href);
  return {
    data: blob,
    dataUrl: href,
    fileName,
  };
}
/** Performs a GET with authorization.
 * @param {string | [string, any]} url
 * @param {AuthCallOptions} [opt]
 * @returns {Promise<AxiosAuthResponse>} */
export async function authGet(url, opt) {
  opt = normalizeCallOptions(opt);
  const nurl = normalizeURL(url);
  return AuthRequest.get(nurl, opt.config)
    .catch(errorHandler("GET", nurl, opt))
    .then(opt.callback);
}
/** Performs a GET with authorization.
 * @param {string | [string, any]} url
 * @param {AuthCallOptions} [opt]
 * @returns {Promise<AxiosAuthResponse>} */
export async function authGetObject(url, opt) {
  opt = normalizeCallOptions(opt, { defaultResponseData: {} });
  return authGet(url, opt);
}
/** Performs a POST with authorization.
 * @param {string | [string, any]} url
 * @param {any} data
 * @param {AuthCallOptions} [opt]
 * @returns {Promise<AxiosAuthResponse>} */
export async function authPost(url, data, opt) {
  opt = normalizeCallOptions(opt, { defaultResponseData: {} });
  const nurl = normalizeURL(url);
  return AuthRequest.post(nurl, data)
    .catch(errorHandler("POST", nurl, opt))
    .then(opt.callback);
}
/** Performs a PUT with authorization.
 * @param {string | [string, any]} url
 * @param {any} data
 * @param {AuthCallOptions} [opt]
 * @returns {Promise<AxiosAuthResponse>} */
export async function authPut(url, data, opt) {
  opt = normalizeCallOptions(opt, { defaultResponseData: {} });
  const nurl = normalizeURL(url);
  return AuthRequest.put(nurl, data)
    .catch(errorHandler("PUT", nurl, opt))
    .then(opt.callback);
}
/**
 * Creates an error handler that normalizes the error response and reports
 * the error to sentry.
 * @param {"GET" | "POST" | "PUT"} operation
 * @param {string} nurl Normalized url.
 * @param {AuthCallOptions} opt,
 * @param {any} [data]
 */
function errorHandler(operation, nurl, opt, data) {
  return err => {
    logError(err, {
      tags: { url: nurl },
      extra: {
        in: data,
        out: err?.response?.data,
      },
    });
    /** @type {import("axios").AxiosResponse} */
    const response = err.response || {
      config: {},
      data: opt.defaultResponseData,
      error: err,
      headers: {},
      status: 0,
      statusText: "",
    };
    response.error = {
      ...response.data,
    };
    response.errorFields = getErrorFields(response.error);
    response.data = opt.defaultResponseData;
    if (IS_DEV) {
      console.warn(
        `DEFAULT DATA returned for ${operation} "${nurl}"`,
        opt.defaultResponseData,
      );
    }
    return response;
  };
}
/**
 * Gets a errors from the given response data and normalizes them into a map
 * of field names to error messages.
 * @param {{ errors?:Array<{field?:string,description:string}> | {[field:string]:Array<string>} }} data
 * @returns {{ [field:string]: string }}
 */
function getErrorFields(data = {}) {
  const { errors } = data;
  if (!errors) {
    return undefined;
  }
  let errorFields;
  if (Array.isArray(errors)) {
    // Array of error objects with possible "field" prop.
    errors.forEach(obj => {
      if (obj.field) {
        if (!errorFields) {
          errorFields = {};
        }
        errorFields[lowerCamelCase(obj.field)] = obj.description;
      }
    });
  } else if (errors) {
    // Swagger style errors, object with field name props.
    const fields = Object.keys(errors);
    if (fields.length > 0) {
      errorFields = {};
      fields.forEach(field => {
        errorFields[lowerCamelCase(field)] = errors[field].join(" ");
      });
    }
  }
  return errorFields;
}

const InvalidTokenErrorCode = "InvalidToken";
export function hasInvalidTokenError(error) {
  if (!error) {
    return false;
  }
  if (error.code === InvalidTokenErrorCode) {
    return true;
  }
  const { errors } = error;
  if (!Array.isArray(errors)) {
    return false;
  }
  return errors.filter(err => err.code === InvalidTokenErrorCode).length > 0;
}

/** @param {AuthCallOptions} [opt]
 * @param {AuthCallOptions} [defaults]
 * @returns {AuthCallOptions}
 */
function normalizeCallOptions(opt, defaults) {
  return {
    callback: returnResponse,
    defaultResponseData: [],
    ...defaults,
    ...opt,
  };
}

/** @param {string | [string, any]} url */
function normalizeURL(url) {
  if (!Array.isArray(url)) {
    return url;
  }
  const len = url.length;
  if (len < 2) {
    return url[0];
  }
  const query = qs.stringify(url[1]);
  if (query.length < 1) {
    return url[0];
  }
  return `${url[0]}?${query}`;
}

/** Default response handler that simply returns the response.
 * @param {AxiosAuthResponse} response
 */
function returnResponse(response) {
  return response;
}

/** Returns true if an auth token has been set and is not expired.
 * @returns {boolean}
 */
export function hasAuthRequestToken() {
  return !!authToken && authExpirationDate > new Date();
}
/** Assigns the token to be sent with each auth request.
 * @param {string} token Server token.
 * @param {string|number|Date} expiration Date and Time of expiration.
 */
export function setAuthRequestToken(token, expiration) {
  if (arguments.length < 2) {
    throw new Error("Token and expiration required.");
  }
  removeAuthRequestToken();
  if (token) {
    authToken = token;
    authExpirationDate = new Date(expiration);
    authInterceptorId = AuthRequest.interceptors.request.use(
      applyAuthHeaders,
      // CONSIDER: An error handler can be passed. (Useful for refresh token
      // logic, to retry requests after refreshing the access token.)
      // (err) => Promise.reject(err),
    );
  }
}
/** Removes the token to be sent with each auth request. */
export function removeAuthRequestToken() {
  authToken = undefined;
  authExpirationDate = undefined;
  if (authInterceptorId !== undefined) {
    AuthRequest.interceptors.request.eject(authInterceptorId);
    authInterceptorId = undefined;
  }
}
/** @param {AxiosRequestConfig} config */
function applyAuthHeaders(config) {
  config.headers.Authorization = `Bearer ${authToken}`;
  return config;
}

// #region Typedefs
/**
 * @typedef {import('axios').AxiosResponse} AxiosResponse
 * @typedef {import('axios').AxiosPromise} AxiosPromise
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 *
 * @typedef {object} AuthResponseError
 * @property {number} code
 * @property {string} message

 * @typedef {AxiosResponse & {error?:AuthResponseError}} AxiosAuthResponse

 * @typedef {object} CompatAPIResult
 * @property {boolean} success True if successful.
 * @property {object} data Data returned from server (or default data).
 * @property {boolean} loading Always `false`.
 * @property {string} [message] Error message from server.
 * @property {number} [code] Error code from server.
 *
 * @typedef {object} AuthCallOptions
 * @property {(response:AxiosAuthResponse)=>AxiosAuthResponse} [callback] Final
 * callback that decides the return value of the promise chain.
 * @property {AxiosRequestConfig} [config] Axios config for the request.
 * @property {any} [defaultResponseData] Default response data returned in case
 * of an error.
 * @property {string} doing String to finish a sentence like this:
 * "An error occurred while ..."
 *
 */
// #endregion
