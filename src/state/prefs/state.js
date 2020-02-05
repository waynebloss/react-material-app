import { AuthActions } from "../auth/actions";
import { PrefActions } from "./actions";
/**
 * Preferences state (**persisted**).
 * @example
 * {
 *    hidePay: true,
 *    hideInfo: true,
 * }
 */
export const PrefState = {
  name: "prefs",
  persist: true,
  defaults: {
    hidePay: true,
    hideInfo: true,
  },
  handlers: {
    [AuthActions.type.LOGOUT_SUCCESS](state, action) {
      return PrefState.defaults;
    },
    [PrefActions.type.PREFS_UPDATE](state, { type, ...prefs }) {
      return {
        ...state,
        ...prefs,
      };
    },
  },
};
