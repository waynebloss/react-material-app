import pathToRegexp from "path-to-regexp";
import querySerializer from "query-string";

/** Default base path, the base path for this app. */
const _defaultPath = process.env.REACT_APP_BASENAME || "/";
/** Map of path compiler functions by path pattern.
 * @type {{[path:string]: (params:object)=> string}}
 */
const _pathCompiler = {};

/**
 * Returns the given path with a leading forward-slash.
 * @param {string} path
 */
export function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}
/** Returns a link object or URL for the given arguments.
 * @param {RouteDefOrURL} route
 * @param {RouteAction} action
 * @returns {{pathname?:string,search?:string,hash?:string,state?:object}}
 */
function buildLinkObject(routeOrURL, action) {
  if (!routeOrURL || typeof routeOrURL === "string") {
    return routeOrURL;
  }
  const { params, query, hash } = action;
  let pathname = routeOrURL.path;
  if (params) {
    const pathData = pathDataFromParams(routeOrURL, params);
    pathname = compileParamsToPath(pathname, pathData) || "/";
  }
  if (query) {
    const search = "?" + querySerializer.stringify(query);
    return {
      pathname,
      search,
      hash,
    };
  }
  return {
    pathname,
    hash,
  };
}

/** Returns a URL for the given arguments.
 * @param {RouteDefOrURL} route
 * @param {RouteAction} action
 * @returns {string}
 */
function buildURL(routeOrURL, action) {
  if (!routeOrURL) return routeOrURL; // undefined, null
  let path = typeof routeOrURL === "string" ? routeOrURL : routeOrURL.path;
  const { params, query } = action;
  if (params) {
    const pathData = pathDataFromParams(routeOrURL, params);
    path = compileParamsToPath(path, pathData) || "/";
  }
  if (query) {
    const search = querySerializer.stringify(query);
    return `${path}?${search}`;
  }
  return path;
}
/** Returns a path for the given pattern and params.
 * Uses a cached regexp function internally.
 *
 * Example:
 * ```js
 * compileParamsToPath('/foos/:fooId/bars/:barId/', {
 *    fooId: 1,
 *    barId: 2
 * }); // returns '/foos/1/bars/2/'
 * ```
 * @param {string} pattern
 * @param {object} [params]
 * @returns {string}
 */
function compileParamsToPath(pattern, params = {}) {
  let toPath = _pathCompiler[pattern];
  if (!toPath) {
    toPath = pathToRegexp.compile(pattern);
    _pathCompiler[pattern] = toPath;
  }
  return toPath(params);
}
/** Transforms params for use by compileParamsToPath.
 * @param {RouteDefinition} route
 * @param {RouteParams} params
 * @returns {object}
 */
function pathDataFromParams(route, params = {}) {
  return Object.keys(params).reduce((data, key) => {
    const value = params[key];
    data[key] = pathDataFromParamValue(route, key, value);
    return data;
  }, {});
}
/** Transforms a single param for use by compileParamsToPath.
 * @param {RouteDefinition} route
 * @param {string} key
 * @param {object} value
 */
function pathDataFromParamValue(route, key, value) {
  if (typeof route.toPath === "function") {
    return route.toPath(value, key);
  }
  // CONSIDER: Process the output of toPath with the rest of these rules...
  else if (typeof value === "string") {
    // TODO: Figure out why redux-first-router splits values containing a slash.
    if (value.indexOf("/") > -1) {
      return value.split("/");
    }

    if (route.capitalizedWords === true) {
      return value.replace(/ /g, "-").toLowerCase();
    }

    return value;
  } else if (typeof value === "number") {
    return value;
  }
}
/** Returns the current site URL, e.g. `https://site.com`. */
function siteFromWindowLocation() {
  const { host, protocol } = window.location;
  return protocol + "//" + host;
}
/**
 * Returns the given path with any leading forward-slash removed.
 * @param {string} path
 */
export function stripLeadingSlash(path) {
  return path.charAt(0) === "/" ? path.substr(1) : path;
}
/**
 * Returns the given path with any trailing forward-slash removed.
 * @param {string} path
 */
export function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === "/" ? path.slice(0, -1) : path;
}
/** Class to build absolute and relative URLs for a given site and base path.
 * Produces URLs from a route definition, action or path pattern along with
 * params and/or a query object.
 * @param {URLBuilderOptions} [options] Configuration options.
 */
export class URLBuilder {
  /** Creates a new URL Builder.
   * @param {URLBuilderOptions} [options] Configuration options.
   */
  constructor(options = {}) {
    const {
      path = _defaultPath,
      site = siteFromWindowLocation(),
      types = {},
      paths = {},
    } = options;
    /** Path within the site, e.g. `/the-app` or `/`. */
    this.path = addLeadingSlash(path);
    /** Site URL, e.g. `http://site.com`. */
    this.site = stripTrailingSlash(site);
    /** Maps type to route definition. */
    this.types = types;
    /** Maps path to route definition. */
    this.paths = paths;
  }
  /** Builds an absolute URL.
   * @param {RouteDefOrActionOrURL} route The route definition, action or URL.
   * @param {RouteActionOrParams} [actionOrParams] The route action or params.
   * @param {RouteQuery} [query] The route query object.
   * @returns {string}
   */
  abs(route, actionOrParams, query) {
    let path = typeof route === "string" ? route : build.apply(this, arguments);
    return stripTrailingSlash(this.base) + addLeadingSlash(path);
  }
  /** Base URL (site URL + path).
   * @returns {string}
   */
  get base() {
    return this.site + this.path;
  }
  /** Builds a link object or URL to the given route definition.
   * @param {RouteDefOrActionOrURL} route The route definition, action or URL.
   * @param {RouteActionOrParams} [actionOrParams] The route action or params.
   * @param {RouteQuery} [query] The route query object.
   * @returns {{pathname?:string,search?:string,hash?:string,state?:object}}
   */
  link(route, actionOrParams, query, hash) {
    switch (arguments.length) {
      case 0:
        return undefined;
      case 1:
        if (typeof route === "string" || !route) {
          return route; // URL string, undefined, null;
        }
        if (route.path) {
          return route.path; // URL string
        }
        actionOrParams = route;
        route = this.types["" + actionOrParams.type];
        return buildLinkObject(route, actionOrParams);
      case 2:
        return buildLinkObject(route, actionOrParams);
      case 3:
        return buildLinkObject(route, {
          params: actionOrParams,
          query,
        });
      default:
        return buildLinkObject(route, {
          params: actionOrParams,
          query,
          hash,
        });
    }
  }
  /** Builds a URL relative to the root of the site.
   * @param {RouteDefOrActionOrURL} route The route definition, action or URL.
   * @param {RouteActionOrParams} [actionOrParams] The route action or params.
   * @param {RouteQuery} [query] The route query object.
   * @returns {string}
   */
  root(route, actionOrParams, query) {
    return (
      stripTrailingSlash(this.path) +
      addLeadingSlash(build.apply(this, arguments))
    );
  }
  /** Builds a relative URL to the given route definition.
   * @param {RouteDefOrActionOrURL} route The route definition, action or URL.
   * @param {RouteActionOrParams} [actionOrParams] The route action or params.
   * @param {RouteQuery} [query] The route query object.
   * @returns {string}
   */
  to(route, actionOrParams, query) {
    switch (arguments.length) {
      case 0:
        return undefined;
      case 1:
        if (typeof route === "string" || !route) {
          return route; // URL string, undefined, null;
        }
        if (route.path) {
          return route.path; // URL string
        }
        actionOrParams = route;
        route = this.types["" + actionOrParams.type];
        return buildURL(route, actionOrParams);
      case 2:
        return buildURL(route, actionOrParams);
      default:
        return buildURL(route, {
          params: actionOrParams,
          query,
        });
    }
  }
}
export default URLBuilder;
/** Alias for `URLBuilder.prototype.to` */
const build = URLBuilder.prototype.to;

/** @typedef {(value:object, key:string)=> string} ConvertValueToPath */

/** @typedef {object} RouteAction
 * @prop {string?} type The type of RouteDefinition to lookup.
 * @prop {RouteParams?} params Route parameters to merge into the path.
 * @prop {RouteQuery?} query Route query values to create a query string.
 */

/** @typedef {object} RouteDefinition
 * @prop {string} path Relative URL path, e.g. `/`, `/the/page`, etc.
 * @prop {ConvertValueToPath?} toPath Function to convert params to path slugs.
 * @prop {boolean?} capitalizedWords Whether path slugs should be proper-cased.
 */

/** @typedef {{[name:string]: object}} RouteParams */

/** @typedef {{[name:string]: object}} RouteQuery */

/** @typedef {RouteAction|RouteParams} RouteActionOrParams */

/** @typedef {RouteDefinition|RouteAction|string} RouteDefOrActionOrURL */

/** @typedef {RouteDefinition|string} RouteDefOrURL */

/** @typedef {object} URLBuilderOptions
 * @prop {string?} path Path within the site, e.g. `/the-app` or `/`.
 * @prop {string?} site URL of the site, e.g. `http://site.com`.
 * @prop {{[PAGE_TYPE:string]: RouteDefinition}} types Maps type to route definition.
 */
