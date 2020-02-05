import React from "react";
import { Box, Container } from "@material-ui/core";
// Local
import companyLogo from "../assets/img/company-logo_300x.png";
import { CopyrightText, VersionText } from "../components";
import { useMobile } from "../themes";
import { useStyles } from "./AuthAreaLayout.styles";

function _AuthAreaLayout(props) {
  const isMobile = useMobile();
  const classes = useStyles();
  const { children } = props;
  return (
    <div className={classes.desktopContainer}>
      <Box className={classes.desktopSidebar}>
        <img src={companyLogo} alt="Company Logo" width="250" />
      </Box>
      <Container
        maxWidth={isMobile ? false : "sm"}
        className={classes.baseContainer}
      >
        <Box className={classes.logoBox}>
          <img src={companyLogo} alt="Company logo, title" width="250" />
        </Box>
        <div className={classes.content}>{children}</div>
        <Box className={classes.footerBox}>
          <VersionText /> <CopyrightText />
        </Box>
      </Container>
    </div>
  );
}

export const AuthAreaLayout = React.memo(_AuthAreaLayout);
