import React from "react";
import { NavLink } from "react-router-dom";
// Local
import { Navigation } from "./Navigation";
import { PageURL } from "./PageURL";
/**
 * Renders a stateful navigation link from a page object.
 *
 * @typedef {object} PageNavLinkProps
 * @property {React.ReactNode} [children]
 * @property {(node:React.ReactNode)=>void | React.Ref<HTMLElement>} [innerRef]
 * @property {import("./URLBuilder").RouteDefOrActionOrURL} to The page
 * definition, route or URL string to link to.
 * @property {boolean} replace
 * @property {import("./URLBuilder").RouteActionOrParams} params The route
 * action or params.
 * @property {import("./URLBuilder").RouteQuery} query The route query object.
 * @property {string} hash String to append as the URL hash.
 * @property {string} activeClassName
 * @property {React.CSSProperties} activeStyle
 * @property {boolean} isActive
 *
 * @extends {React.Component<PageNavLinkProps>}
 *
 * @description NOTE: This is now a `React.Component` class instead of a
 * function because you cannot forward refs with a function.
 * See:
 * - https://github.com/ReactTraining/react-router/issues/6056
 * - https://material-ui.com/components/links/
 */
export class PageNavLink extends React.Component {
  render() {
    const {
      activeClassName: _activeClassName,
      activeStyle: _activeStyle,
      children,
      exact: _exact,
      isActive: _isActive,
      location: _location,
      params,
      query,
      strict: _strict,
      to: page,
      hash,
      ...otherProps
    } = this.props;
    const linkTo = PageURL.link(page, params, query, hash);
    const navProps = {
      activeClassName: _activeClassName,
      activeStyle: _activeStyle,
      exact: _exact,
      isActive: _isActive,
      location: _location || Navigation.location,
      strict: _strict,
    };
    return (
      <NavLink to={linkTo} {...navProps} {...otherProps}>
        {children}
      </NavLink>
    );
  }
}
export default PageNavLink;

// TODO: Expand the property definitions in the jsdoc comments.
