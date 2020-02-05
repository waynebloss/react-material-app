/** True if the browser has been detected as IE11. */
export const ie11 = !!window.MSInputMethodContext && !!document.documentMode;
/**
 * True if iOS (iPhone, iPad, iPod) has been detected.
 * - See [Material-UI SwipeableDrawer](https://material-ui.com/components/drawers/#swipeable-temporary-drawer)
 */
export const iOS =
  process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
