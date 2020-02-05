import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import querySerializer from "query-string";
import { CommonPageTypes } from "./constants";
import { Navigation } from "./Navigation";
import { PageLoader } from "./PageLoader";
import { PageURL } from "./PageURL";

const history = Navigation.init().history;
/** Page definitions by PAGE_TYPE string. Populated by `configurePageArea`
 * where each page in each area of the site are processed.
 *
 * **The global PageURL.types is altered when adding a page to this
 * collection.** This allows `PageURL` to create a URL for a page given
 * just that pages PAGE_TYPE string.
 *
 * @type {{[PAGE_TYPE:string]: PageDefinition}}
 */
const pagesByType = PageURL.types;
/** @type {{[urlpath_pattern:string]: PageDefinition}} */
const pagesByPath = PageURL.paths;

let NotFoundPage;
let isAuthenticated = () => false;
let loginRedirectURL = "/login?after=";
/** @type {AppRouterPageOptions} */
const pageOptions = {
  anon: false,
  pathExact: true,
};

/** @type {RouteDefinition} */
let defaultRoute;
/** @type {{[urlpath:string]: RouteDefinition}} */
const routesByPath = {};
/** @type {{[layoutName:string]: RouteDefinition}} */
const routesByLayoutName = {};
/** @type {RouteDefinition[]} */
const routes = [];

export class AppRouter extends React.PureComponent {
  /** Configures the `AppRouter`
   * @param {AppRouterOptions} options
   */
  static configure(options) {
    const {
      loginCheck = isAuthenticated,
      loginPath = "/login",
      loginRedirectParam = "after",
      pageOptions: { anon = true, pathExact = true },
      rootArea,
      configurePage,
    } = options;
    isAuthenticated = loginCheck;
    loginRedirectURL = `${loginPath}?${loginRedirectParam}=`;
    pageOptions.anon = anon;
    pageOptions.pathExact = pathExact;
    // Build routes. Pages without layouts MUST be first and layout routes last.
    const layoutRoutes = configureLayouts(rootArea);
    configurePageArea(rootArea, { configurePage });
    routes.push(
      // Layout routes must also be sorted with longest paths first.
      ...layoutRoutes.sort((a, b) => a.path.length - b.path.length).reverse(),
    );
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          {routes.map(renderRoute)}
          <Route path={NotFoundPage.path} component={NotFoundPage.view} />
        </Switch>
      </Router>
    );
  }
}
export default AppRouter;

function configureLayouts(area, layoutRoutes = []) {
  const { areas: subAreas, defaultLayout: defaultLayoutName, layouts } = area;
  function mapLayout(layout, layoutName) {
    let { path } = layout;
    if (!path || (routesByPath[path] && routesByPath[path].layout)) {
      throw new Error(`Missing or duplicate layout path found: ${path}`);
    }
    addLayoutRoute(layoutRoutes, layoutName, path, {
      path,
      layout,
      pages: [],
    });
  }
  if (layouts) {
    Object.keys(layouts).forEach(layoutName => {
      const layout = layouts[layoutName];
      mapLayout(layout, layoutName);
      if (layoutName === defaultLayoutName || layoutName === "default") {
        if (defaultRoute) {
          throw new Error("Default layout already defined!");
        }
        // TODO: Allow on default layout per area instead of one for the app.
        // CONSIDER: Maybe
        defaultRoute = routesByPath[layout.path];
      }
    });
  }
  if (subAreas) {
    subAreas.forEach(subArea => configureLayouts(subArea, layoutRoutes));
  }
  return layoutRoutes;
}

function configurePageArea(area, options = {}) {
  const { areas: subAreas, pages } = area;
  if (subAreas) {
    subAreas.forEach(subArea => {
      configurePageArea(subArea, options);
    });
  }
  if (!pages) {
    return;
  }
  const { configurePage = () => undefined } = options;
  Object.keys(pages).forEach(function mapPage(keyForPage) {
    const page = pages[keyForPage];
    let { path, type } = page;
    if (!type || pagesByType[type]) {
      throw new Error(`Missing or duplicate page type found: ${type}`);
    }
    if (type === CommonPageTypes.NOT_FOUND) {
      NotFoundPage = page;
      delete pages[keyForPage];
      return;
    }
    pagesByPath[path] = page;
    pagesByType[type] = page;
    if (path) {
      if (!page.getRouteKey) {
        /** MODIFYING: page is modified to ensure required props.
         * Instead of copying, we apply updates to the original page.
         * This was done so that code outside of this module which already has a
         * reference to a given page can access these modifications.
         */
        page.getRouteKey = getRouteKeyWithPage(page);
      }
    }
    mapPageToRoute(page);
    configurePage(page);
  });
}

function addLayoutRoute(layoutRoutes, layoutName, path, route) {
  routesByPath[path] = route;
  routesByLayoutName[layoutName] = route;
  layoutRoutes.push(route);
}

function addRoute(path, route) {
  routesByPath[path] = route;
  routes.push(route);
}

function mapPageToRoute(page) {
  const { layout: layoutPathOrName } = page;
  if (layoutPathOrName) {
    const layoutRoute =
      routesByLayoutName[layoutPathOrName] || routesByPath[layoutPathOrName];
    if (!layoutRoute) {
      throw new Error(`Layout not found: ${layoutPathOrName}`);
    }
    layoutRoute.pages.push(page);
  } else if (!defaultRoute || layoutPathOrName === null) {
    addRoute(page.path, {
      path: page.path,
      page,
    });
  } else {
    defaultRoute.pages.push(page);
  }
}
/** @param {RouteDefinition} route */
function renderRoute(route) {
  const { path, layout: { view: LayoutView } = {}, page, pages } = route;
  if (page) {
    return renderRouteForPage(page);
  }
  function renderLayout(props) {
    return (
      <LayoutView {...props}>
        <Switch>
          {pages.map(renderRouteForPage)}
          <Route path={NotFoundPage.path} component={NotFoundPage.view} />
        </Switch>
      </LayoutView>
    );
  }
  return <Route key={path} path={path} render={renderLayout} />;
}
/** @param {PageDefinition} page */
function renderRouteForPage(page) {
  const {
    anon = pageOptions.anon,
    loader = true,
    path,
    pathExact: exact = pageOptions.pathExact,
    view,
  } = page;
  const RouteComponent = anon ? Route : PrivateRoute;
  const pageProps = {
    exact,
    path,
  };
  function renderPageLoader(props) {
    return <PageLoader page={page} {...props} />;
  }
  if (loader) {
    pageProps.render = renderPageLoader;
  } else {
    pageProps.component = view;
  }
  return <RouteComponent key={path} page={page} {...pageProps} />;
}

export class PrivateRoute extends React.PureComponent {
  render() {
    const { page, ...props } = this.props;
    return isAuthenticated(page) ? (
      <Route {...props} />
    ) : (
      <Redirect
        to={
          loginRedirectURL +
          encodeURIComponent(props.location.pathname + props.location.search)
        }
      />
    );
  }
}

// #region Route Keys - Uniquely identify pages based on parts of the URL

/** Returns a function that, when called, returns the route key of the page. */
function getRouteKeyWithPage(page) {
  const { key: keySpec } = page;
  function getRouteKeyForPage(params) {
    // NOTE: We only want the path, not a query string, so only pass params.
    return PageURL.to(page, { params });
  }
  if (keySpec) {
    return getRouteKeyWithSpec(page, keySpec, getRouteKeyForPage);
  }
  return getRouteKeyForPage;
}
/** Returns a function that, when called, returns the route key of the page. */
function getRouteKeyWithSpec(page, keySpec, defaultImpl) {
  // TODO: Use keySpec.params to create pathnames like '/prop/value/...'
  // so that we can share view state among different urls (think wizards).
  // This way the uniquness of the key can be independant of the pathname.
  const { query: querySpec } = keySpec;
  if (!querySpec) {
    return defaultImpl;
  }
  if (querySpec === true) {
    return function getRouteKeyIncludingEntireQuery(params, query) {
      return PageURL.to(page, { params, query });
    };
  }
  if (!Array.isArray(querySpec)) {
    return defaultImpl;
  }
  const len = querySpec.length;
  return function getRouteKeyIncludingQuery(params, query) {
    // NOTE: We only want the path, not a query string, so only pass params.
    let pathname = PageURL.to(page, { params });
    if (!query) {
      return pathname;
    }
    const keyValues = {};
    let hasKeyValues = false;
    for (var i = 0; i < len; i++) {
      let prop = querySpec[i];
      if (prop in query) {
        keyValues[prop] = query[prop];
        hasKeyValues = true;
      }
    }
    if (!hasKeyValues) {
      return pathname;
    }
    return pathname + "?" + querySerializer.stringify(keyValues);
  };
}
// #endregion

// #region Typedefs

/**
 * @typedef {object} AppRouterOptions
 * @property {(page:PageDefinition)=> boolean} [loginCheck] Function that
 * returns true if the user is logged in.
 * @property {string} [loginPath] Path to the login page. Default: `'/login'`.
 * @property {string} [loginRedirectParam] Query param name used by the login
 * page to redirect the user after login. Defaults to `'after'`. The router
 * will pass a relative URL via this parameter.
 * @property {AppRouterPageOptions} [pageOptions] Page configuration options.
 * @property {{areas: object[], pages: object[]}} rootArea The root area of the
 * app.
 * @property {(page:PageDefinition)=>void} [configurePage] Function to configure
 * each page definition before it's used by the `AppRouter`.
 */

/**
 * @typedef {object} AppRouterPageOptions
 * @property {boolean} [anon] Default value for page `anon` field.
 * @property {boolean} [pathExact] Default value for page 'pathExact' field.
 */

/**
 * @typedef {object} LayoutDefinition
 * @property {string} path Path of the layout view.
 * @property {React.ComponentType} view The layout view component.
 */

/**
 * @typedef {object} PageDefinition
 * @property {boolean} [anon] True if the page is accessible anonymously.
 * @property {string|null} [layout] Path of the layout view or null for none.
 * @property {boolean} [loader] True to use the page loader. (Default `true`.)
 * @property {string} path URL path to route to this page.
 * @property {string} [title] Default title of the page.
 * @property {string} type A unique type identifier for the page.
 * @property {React.ComponentType} view The page view component.
 */

/**
 * @typedef {object} RouteDefinition
 * @property {string} path
 * @property {LayoutDefinition} [layout]
 * @property {PageDefinition} [page]
 * @property {PageDefinition[]} [pages]
 */

// #endregion
