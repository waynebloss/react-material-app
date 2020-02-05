// For IE11, `react-app-polyfill/ie11` alone did't work:
// import "react-app-polyfill/ie11";

// Polyfilling `Math.sign` fixed page not loading after login:
// import "core-js/features/math/sign";

// However, I couldn't figure out which core-js features to import to make the
// Direct Deposits page work with IE11. Importing every polyfill from there
// makes it work and only adds about 200k to the file size (30k gzipped).
import "core-js";
