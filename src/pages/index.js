// import { DevArea } from "./dev";
import { AuthArea } from "./auth";
import { MainArea } from "./main";
import { TodoArea } from "./todos";

import { MainLayout } from "../layouts";

export const Pages = {
  // dev: DevArea,
  auth: AuthArea.pages,
  main: MainArea.pages,
  todo: TodoArea.pages,
};
export default Pages;

export const AppArea = {
  areas: [
    // DevArea,
    AuthArea,
    MainArea,
    TodoArea,
  ],
  layouts: {
    default: {
      path: "/",
      view: MainLayout,
    },
  },
};

// #region Typedefs
/** Page definition extend for this app.
 * @typedef {object} PageDefinitionEx
 * @property {string[]} [roles] Roles allowed to access the page.
 * @property {string} titleText Title of the page without the site name suffix.
 */
/** Combine PageDefinition and PageDefinitionEx to make Page.
 * @typedef {import("../lib/routing").PageDefinition & PageDefinitionEx} Page
 */
// #endregion
