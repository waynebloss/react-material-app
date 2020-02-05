import { UIActions } from "./actions";
/**
 * UI state (**NOT** persisted).
 * @example
 * {
 *    loading: false,
 *    notification: { duration: number, message: string, variant: "" | "error" }
 * }
 */
export const UIState = {
  name: "ui",
  persist: false,
  defaults: {
    loading: false,
  },
  handlers: {
    [UIActions.type.UI_LOADING_SET](state, { value }) {
      return {
        ...state,
        loading: value,
      };
    },
    [UIActions.type.UI_NOTIFICATION_HIDE](state) {
      return {
        ...state,
        notification: undefined,
      };
    },
    [UIActions.type.UI_NOTIFICATION_SHOW](state, { type, ...notification }) {
      return {
        ...state,
        notification,
      };
    },
  },
};
