import React from "react";
import querySerializer from "query-string";

import { Navigation } from "./Navigation";
import { trackAsync } from "../async";

// #region Typedefs
/** @typedef {import("history").History} History */
/** @typedef {object} RouteProps
 * @property {History} history
 * @property {{key:string,pathname:string,search:string,hash:string,state:object}} [location]
 * @property {{params:object,isExact:boolean,path:string,url:string}} [match]
 */
// #endregion

const NullViewType = () => null;

const _pageMeta = {
  /* [PageType]: {Component, initialized} */
};

/** @param {RouteProps} props */
function createRouteFromProps(props) {
  const { history, location, match, page } = props;
  const { params } = match;
  const query = querySerializer.parse(location.search);
  const route = {
    history,
    key: page.getRouteKey(params, query),
    params,
    query,
    location,
    match,
    page,
  };
  return route;
}

async function initPage(page) {
  const { type } = page;
  const pageMeta = _pageMeta[type];
  let { cancelled, value } = await trackAsync(() => page.init());
  if (cancelled) return undefined;
  if (typeof value === "function") {
    value = { view: value };
  }
  if (value.view) {
    pageMeta.Component = value.view;
  }
  pageMeta.initialized = true;
  return pageMeta;
}

async function loadPage(route) {
  const { page } = route;
  const { cancelled, value } = await trackAsync(() => page.load(route));
  if (cancelled) return undefined;
  return value;
}

function setDocumentTitle(page) {
  // CONSIDER: We could also get the page title by calling a function on `page`
  // or by passing the page view (PageView) component after its loaded and
  // then calling a static field/method on that...
  window.document.title = page.title || page.type;
}

function shouldInitPage(page) {
  const { type } = page;
  let pageMeta = _pageMeta[type];
  if (!pageMeta) {
    pageMeta = {
      Component: page.view,
    };
    _pageMeta[type] = pageMeta;
  } else if (pageMeta.initialized) {
    return false;
  }
  if (!page.init) {
    pageMeta.initialized = true;
    return false;
  }
  return true;
}

export class PageLoader extends React.PureComponent {
  state = {
    PageView: undefined,

    data: undefined,
    loading: true,
    LoadingView: undefined,

    route: undefined,
  };

  constructor(props) {
    super(props);
    // Initialize state.
    const { page } = props;
    const route = createRouteFromProps(props);
    const state = this.state;
    state.route = route;
    state.PageView = page.view;
    state.loading = !!(page.init || page.loading);
    if (!state.loading) {
      if (!state.PageView) {
        state.PageView = NullViewType;
      }
    }
  }

  componentDidMount() {
    const { route } = this.state;
    this.routeChanged(route);
  }

  componentDidUpdate(prevProps, prevState) {
    const { props } = this;
    if (prevProps === props) {
      return;
    }
    const route = createRouteFromProps(props);
    this.routeChanged(route, prevState.route);
  }

  render() {
    const {
      state: {
        // data,
        loading,
        PageView,
        route,
      },
    } = this;
    if (loading && !PageView) {
      return null;
    }
    return [<PageView key={route.key} pageRoute={route} />];
  }

  routeChanged = async (route, prevRoute) => {
    const { page } = route;
    const { type } = page;
    Navigation.routeChanged(route);
    setDocumentTitle(page);
    let loading = !!page.load;
    let pageMeta;
    if (shouldInitPage(page)) {
      pageMeta = await initPage(page);
      if (!pageMeta) {
        return; // Cancelled.
      }
      loading = !!page.load;
      this.setState({
        data: undefined,
        loading,
        PageView: pageMeta.Component || NullViewType,
        route,
      });
    } else if (prevRoute) {
      pageMeta = _pageMeta[type];
      this.setState({
        data: undefined,
        loading,
        PageView: pageMeta.Component || NullViewType,
        route,
      });
    }
    if (!loading) {
      window.setTimeout(Navigation.updateScroll, 200, prevRoute, route);
      return; // Finished.
    }
    let result = await loadPage(route);
    if (!result) {
      return; // Cancelled.
    }
    loading = false;
    this.setState({
      loading,
      data: result.data,
    });
    window.setTimeout(Navigation.updateScroll, 200, prevRoute, route);
  };
}
export default PageLoader;
