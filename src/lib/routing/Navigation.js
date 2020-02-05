import { createBrowserHistory, createLocation } from "history";
import { matchPath } from "react-router";
import ScrollBehavior from "scroll-behavior";

import ScrollStateStorage from "./ScrollStateStorage";
import { addLeadingSlash } from "./URLBuilder";
import { PageURL } from "./PageURL";

/** @type {string} */
let _currentKey;
/** @type {{params:object,isExact:boolean,path:string,url:string}} */
let _currentMatch = {};
/** @type {{anon:boolean,path:string,type:string,view:React.ComponentType}} */
let _currentPage;
/** @type {{[x:string]:string}} */
let _currentParams = {};
/** @type {{[x:string]:string}} */
let _currentQuery = {};
/** @type {History} */
let _history;
/** @type {import('scroll-behavior').default} */
let _scrollBehavior;

const routeChangedHandlers = [];

export const Navigation = {
  /** The navigation history API.
   * @type {History}
   */
  get history() {
    return _history;
  },
  /** The current location.
   * @type {Location}
   */
  get location() {
    return _history.location;
  },
  /** The current relative URL (pathname + search + hash). */
  get locationURL() {
    const loc = _history.location;
    return loc.pathname + loc.search + loc.hash;
  },

  /** Initialize navigation.
   * @param {NavigationOptions} [config]
   */
  init(config = {}) {
    configureHistory(config);
    configureScrollBehavior(config);
    return Navigation;
  },

  // #region Core Navigation
  /** Navigates to the given `url` via the HTML5 History API.
   * @param {string} url
   * @param {object} [state]
   */
  go(url, state) {
    _history.push(url, state);
    return true;
  },
  /** Navigates backward via the HTML5 History API. */
  goBack() {
    _history.goBack();
    return true;
  },
  /** Navigates forward via the HTML5 History API. */
  goForward() {
    _history.goForward();
    return true;
  },
  /** Navigates to the given `url` via `window.location.assign`.
   *
   * **Warning: This unloads the current browser window.**
   *
   * @param {string} url
   */
  load(url) {
    window.location.assign(url);
    return true;
  },
  /** Navigates to the given `url`, replacing the current spot in history
   * with the new `url` via the HTML5 History API.
   * @param {string} url
   * @param {object} [state]
   */
  redirect(url, state) {
    _history.replace(url, state);
    return true;
  },
  /** Navigates to the given `url` via `window.location.replace`.
   *
   * **Warning: This unloads the current browser window.**
   *
   * @param {string} url
   */
  reload(url) {
    window.location.replace(url);
    return true;
  },
  /**
   * Navigates to the given page. Similar to `Navigation.go`, but with a
   * page object, params and query object instead of a url string.
   * @param {any} page
   * @param {any} [params]
   * @param {any} [query]
   * @param {any} [state]
   */
  to(page, params, query, state) {
    return Navigation.go(
      PageURL.to(page, {
        params,
        query,
      }),
    );
  },
  // #endregion

  // #region Current Route Info

  /** The current route key. */
  get key() {
    return _currentKey;
  },
  /** The current route match. */
  get match() {
    return _currentMatch;
  },
  /** The current page. */
  get page() {
    return _currentPage;
  },
  /** The current route path params. */
  get params() {
    return _currentParams;
  },
  /** The current route query params. */
  get query() {
    return _currentQuery;
  },
  /**
   * Returns true if the given url matches the current location.
   *
   * See https://stackoverflow.com/questions/52275146/usage-of-exact-and-strict-props
   *
   * @typedef {object} URLIsActiveOptions
   * @property {boolean} [exact] True if path should match exactly. (`false`)
   * @property {boolean} [strict] True if slashes should be matched. (`false`)
   *
   * @param {string} url
   * @param {URLIsActiveOptions} options
   */
  isActive(url, options) {
    if (!url) {
      return false;
    }
    let exact = false;
    let strict = false;
    if (options) {
      exact = !!options.exact;
      strict = !!options.strict;
    }
    // See https://github.com/ReactTraining/react-router/blob/bb802cdf5112df93445d6ff599dda2c40edf02c6/packages/react-router-dom/modules/NavLink.js
    const { location: currentLocation } = _history;
    const { pathname: pathToMatch } = currentLocation;
    const toLocation = createLocation(url, null, null, currentLocation);
    const { pathname: path } = toLocation;
    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath =
      path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    return escapedPath
      ? !!matchPath(pathToMatch, { path: escapedPath, exact, strict })
      : false;
  },
  /**
   * Subscribes the given `handler` to route changes and returns a removal
   * function.
   * @param {function} handler
   */
  onRouteChanged(handler) {
    routeChangedHandlers.push(handler);
    /** Removes the handler and returns `true` if the handler was found. */
    function remove() {
      const i = routeChangedHandlers.indexOf(handler);
      const found = i > -1;
      if (found) routeChangedHandlers.splice(i, 1);
      return found;
    }
    return remove;
  },
  /** Call after the route changes, to update route properties.
   * @param {ExtendedRouteProps} route Extended route props (from PageLoader).
   */
  routeChanged(route) {
    const { key, match, page, params, query } = route;
    _currentKey = key;
    _currentMatch = match;
    _currentPage = page;
    _currentParams = params;
    _currentQuery = query;
    // IMPORTANT: Copy array so handler-removal doesn't affect this loop.
    routeChangedHandlers.slice().forEach(handler => handler(route));
  },
  // #endregion

  /** Delayed navigation. */
  delayed(url, timeout = 400) {
    window.setTimeout(() => {
      Navigation.go(url);
    }, timeout);
  },

  /** Call after a page transition to start track the scroll position for
   * the current URL and possibly restore the scroll position.
   * @param {{location:object}} prevRoute The previous route.
   * @param {{location:object}} route The current route.
   */
  updateScroll(prevRoute, route) {
    const prevLoc = prevRoute ? prevRoute.location : {};
    const loc = route ? route.location : {};
    if (loc.search.indexOf("_noscroll=1") > -1) {
      return;
    }
    if (_history.action === "POP" || route.location.hash) {
      _scrollBehavior.updateScroll(prevLoc, loc);
    } else {
      window.scrollTo(0, 0);
    }
  },
};
export default Navigation;

/** @param {NavigationOptions} config */
function configureHistory(config) {
  let { basename = process.env.REACT_APP_BASENAME || "/" } = config;
  _history = createBrowserHistory({
    basename: addLeadingSlash(basename),
  });
}

function configureScrollBehavior() {
  let stateStorage = new ScrollStateStorage();
  _scrollBehavior = new ScrollBehavior({
    addTransitionHook: _history.listen,
    stateStorage,
    getCurrentLocation: getCurrentLocationForScrollBehavior,
  });
}

function getCurrentLocationForScrollBehavior() {
  return _history.location;
}

// Functions we may need some day:
//
// function normalizeToLocation(to, currentLocation) {
//   // From https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/utils/locationUtils.js
//   return typeof to === "string"
//     ? createLocation(to, null, null, currentLocation)
//     : to;
// }

// function resolveToLocation(to, currentLocation) {
//   // From https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/utils/locationUtils.js
//   return typeof to === "function" ? to(currentLocation) : to;
// }

if (process.env.NODE_ENV === "development") {
  window.Navigation = Navigation;
}

// #region Typedefs
/** @typedef {import("history").BrowserHistoryBuildOptions} BrowserHistoryBuildOptions */
/** @typedef {(confirmed:boolean)=> void} ConfirmationCallback */
/** @typedef {import("history").History} History */
/** @typedef {'INITIAL' | import("history").Action} HistoryAction */
/** @typedef {import("history").Location} Location */
/** @typedef {object} NavigationOptions
 * @property {string} [basename] The base URL of the app.
 * @property {boolean} [forceRefresh] Set true to force full page refreshes.
 * @property {(message:string,callback:ConfirmationCallback)=> void} [getUserConfirmation] A function to use to confirm navigation with the user.
 * @property {} [keyLength] The length of `location.key`.
 */
/** @typedef {object} ExtendedRouteProps
 * @property {History} history
 * @property {string} key
 * @property {{key:string,pathname:string,search:string,hash:string,state:object}} [location]
 * @property {{params:object,isExact:boolean,path:string,url:string}} [match]
 * @property {{anon:boolean,path:string,type:string,view:React.ComponentType}} page
 * @property {{[x:string]:string}} params
 * @property {{[x:string]:string}} query
 */
// #endregion
