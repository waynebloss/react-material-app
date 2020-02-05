import React from "react";
import { Link } from "react-router-dom";
// Local
import { PageURL } from "./PageURL";
/**
 * Renders a link from a page object.
 *
 * @typedef {object} PageLinkProps
 * @property {React.ReactNode} [children]
 * @property {(node:React.ReactNode)=>void | React.Ref<HTMLElement>} [innerRef]
 * @property {import("./URLBuilder").RouteDefOrActionOrURL} to The page
 * definition, route or URL string to link to.
 * @property {boolean} replace
 * @property {import("./URLBuilder").RouteActionOrParams} params The route
 * action or params.
 * @property {import("./URLBuilder").RouteQuery} query The route query object.
 * @property {string} hash String to append as the URL hash.
 *
 * @extends {React.Component<PageLinkProps>}
 *
 * @description NOTE: This is now a `React.Component` class instead of a
 * function because you cannot forward refs with a function.
 * See:
 * - https://github.com/ReactTraining/react-router/issues/6056
 * - https://material-ui.com/components/links/
 */
export class PageLink extends React.Component {
  render() {
    const {
      children,
      innerRef,
      replace,
      to: page,
      params,
      query,
      hash,
      ...otherProps
    } = this.props;
    const linkTo = PageURL.link(page, params, query, hash);
    const linkProps = {
      innerRef,
      replace,
    };
    return (
      <Link to={linkTo} {...linkProps} {...otherProps}>
        {children}
      </Link>
    );
  }
}
export default PageLink;

// TODO: Expand the property definitions in the jsdoc comments.
