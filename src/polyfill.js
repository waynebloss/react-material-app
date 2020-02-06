/**
 * @file Import this at the very top of the `src/index.js` file to make the app
 * backwards compatible with older browsers. To trim the js bundle size,
 * consider importing individual polyfills as needed, shown below.
 */

// For IE11, `react-app-polyfill/ie11` alone did't work:
// import "react-app-polyfill/ie11";

// Polyfilling `Math.sign` fixed page not loading after login:
// import "core-js/features/math/sign";

// However, I couldn't figure out which core-js features to import to make other
// problem pages work with IE11. Importing every polyfill from here makes them
// work and only adds about 200k to the file size (30k gzipped).
import "core-js";
