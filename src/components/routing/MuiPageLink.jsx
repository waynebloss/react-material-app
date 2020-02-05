import React from "react";
import { Link as MuiLink } from "@material-ui/core";
// Local
import { PageLink } from "../../lib";

/**
 * `Material-UI` link with `react-router-dom` routing using our pages data
 * structure.
 * @param {import("../../lib").PageLinkProps & import("@material-ui/core/Link").LinkProps} props
 */
export function MuiPageLink(props) {
  const { children, ...rest } = props;
  return (
    <MuiLink component={PageLink} {...rest}>
      {children}
    </MuiLink>
  );
}
