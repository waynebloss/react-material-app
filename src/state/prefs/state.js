import { AuthActions } from "../auth/actions";
import { PrefActions } from "./actions";
/**
 * Preferences state (**persisted**).
 * @example
 * {
 *    dialogEdit: true,
 * }
 */
export const PrefState = {
  name: "prefs",
  persist: true,
  defaults: {
    dialogEdit: true,
  },
  handlers: {
    [AuthActions.type.LOGOUT_SUCCESS](state, action) {
      return PrefState.defaults;
    },
    [PrefActions.type.PREFS_DIALOGEDIT_TOGGLE](state, { type, ...prefs }) {
      return {
        ...state,
        dialogEdit: !state.dialogEdit,
      };
    },
    [PrefActions.type.PREFS_UPDATE](state, { type, ...prefs }) {
      return {
        ...state,
        ...prefs,
      };
    },
  },
};
