import React from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Snackbar,
} from "@material-ui/core";
// Local
import { iOS } from "../device";
import { CloseIcon } from "../components";
import { useInstalledPWA } from "../lib";
import { useMobile } from "../themes";
import { MainMenu } from "./MainMenu";
import { useStyles } from "./MainLayout.styles";
import { connectView, uiLoading, uiNotification, UIActions } from "../state";

function _MainLayout({
  actions: { hideNotification, showNotification },
  children,
  uiLoading,
  uiNotification,
}) {
  const isInstalled = useInstalledPWA();
  const isMobile = useMobile();
  const classes = useStyles();
  const onClickInstallApp = React.useCallback(
    e => {
      e.preventDefault();
      showNotification(
        "To install the app, click the Share button, scroll down and tap " +
          "Add to Home Screen",
      );
    },
    [showNotification],
  );
  return (
    <>
      <Container maxWidth="xl">
        <div className={classes.menuContainer}>
          <MainMenu />
          <div className={classes.content}>
            {children}
            {iOS && // Example to tell iOS users to install the PWA:
              !isInstalled && (
                <div className={classes.installNotice}>
                  <Button
                    variant="text"
                    color="primary"
                    size="large"
                    fullWidth={isMobile}
                    onClick={onClickInstallApp}
                  >
                    Install App
                  </Button>
                </div>
              )}
          </div>
        </div>
      </Container>
      <Backdrop className={classes.loadingBackdrop} open={uiLoading}>
        <CircularProgress size={128} />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={uiNotification?.duration}
        className={classes.notificationUI}
        open={!!uiNotification}
        onClose={hideNotification}
        ContentProps={{
          "aria-describedby": "notification-message",
        }}
        message={
          <span id="notification-message">{uiNotification?.message}</span>
        }
        action={
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={hideNotification}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </>
  );
}
export const MainLayout = connectView(
  _MainLayout,
  state => ({
    ...uiLoading(state),
    ...uiNotification(state),
  }),
  [UIActions],
);
