import { createMuiTheme, useMediaQuery } from "@material-ui/core";

/** Material-ui default theme, to copy from where necessary. */
// const defaults = createMuiTheme();

// #region Example to copy shadows from default theme.
/**
 * Override box shadows[3]. Must provide all 25 array elements...
 * - https://github.com/mui-org/material-ui/issues/8780
 * - https://gist.github.com/phacks/6c3c3a5f395f6e9660ae132c237250a3
 */
// const boxShadow = "0 0 4px -4px rgba(0,0,0,0.12), 0 0 8px 0 rgba(0,0,0,0.16)";
// const shadows = [...defaults.shadows];
// shadows[3] = boxShadow;
// #endregion

/**
 * Default theme for the app based on the
 * [Materiaul UI default theme](https://material-ui.com/customization/default-theme/)
 * with example overrides.
 */
export const defaultTheme = createMuiTheme({
  palette: {
    type: "light",
    // primary: { main: "#3f51b5" },
    // secondary: { main: "#f50057" },
  },
  // #region Example global overrides for this theme:
  // overrides: {

  //   // Example to override "contained" variant of the Material-ui Button:
  //   // MuiButton: {
  //   //   contained: {
  //   //     boxShadow: "none",
  //   //     "&:hover": {
  //   //       boxShadow: "none",
  //   //     },
  //   //   },
  //   // },

  //   // Example to override the "contained" variant of Material-ui ButtonGroup:
  //   // MuiButtonGroup: {
  //   //   contained: {
  //   //     boxShadow: "none",
  //   //     border: "1px solid rgba(0,0,0,0.16)",
  //   //   },
  //   // },

  //   // Example to override the paper style of the Material-ui Menu:
  //   // MuiMenu: {
  //   //   paper: {
  //   //     boxShadow,
  //   //   },
  //   // },

  // },
  // #endregion

  // #region Example default props for any Material-ui components rendered with
  // this theme:
  // props: {
  //   MuiCard: {
  //     variant: "outlined",
  //   },
  // },
  // #endregion

  // Example to set custom shadows:
  // shadows,
});

/**
 * Returns `true` if the screen is sized for mobile. Depends on theme
 * breakpoints, otherwise this function would be defined in `lib/hooks.js`
 */
export function useMobile(size = "xs") {
  return useMediaQuery(defaultTheme.breakpoints.down(size));
}
