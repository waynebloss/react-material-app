import { AuthActions } from "./actions";
/**
 * Authentication / Authorization state (**persisted**).
 * @example
 * {
 *  email: "demouser@gmail.com",
 *  token: "xxx-yyy-zzz",
 *  expiration: "2020-09-17T13:41:08Z",
 *  company: { id: 999, name: "Demo Company" },
 *  user: {
 *   id: 123,
 *   firstName: "Demo",
 *   lastName: "User",
 *  },
 * }
 */
export const AuthState = {
  name: "auth",
  persist: true,
  defaults: {},
  handlers: {
    /**
     * @typedef {object} LoginSuccessAction
     * @property {string} type
     * @property {LoginSuccessActionData} data
     *
     * @typedef {object} LoginSuccessActionData
     * @property {string} email
     * @property {string} token
     * @property {string} expiration
     * @property {{id:number,name:string}} company
     * @property {{id:number,firstName:string,lastName:string}} user
     *
     * @param {object} state
     * @param {LoginSuccessAction} action
     */
    [AuthActions.type.LOGIN_SUCCESS](state, { data }) {
      return {
        ...state,
        ...data,
      };
    },
    [AuthActions.type.LOGOUT_REQUEST](state, action) {
      // HACK: Clear values at beginning of logout too; attempting to fix logout
      // not working while running in PWA...
      return AuthState.defaults;
    },
    [AuthActions.type.LOGOUT_SUCCESS](state, action) {
      return AuthState.defaults;
    },
  },
};
