import React from "react";
import { Link as MuiLink } from "@material-ui/core";
// Local
import { PageNavLink } from "../../lib";

/**
 * `Material-UI` link with `react-router-dom` routing using our pages data
 * structure.
 * @param {import("../../lib").PageNavLinkProps & import("@material-ui/core/Link").LinkProps} props
 */
export function MuiPageNavLink() {
  const { children, ...rest } = this.props;
  return (
    <MuiLink component={PageNavLink} {...rest}>
      {children}
    </MuiLink>
  );
}
