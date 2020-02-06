import {
  // authPost,
  setAuthRequestToken,
  removeAuthRequestToken,
} from "../../lib";
import { UIActions } from "../ui/actions";

const type = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",

  LOGOUT_REQUEST: "LOGOUT_REQUEST",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
};

export const AuthActions = {
  type,

  confirmAccount({ email, token, password1, password2 }) {
    return async dispatch => {
      // const response = await authPost("/api/auth/confirm", {
      //   email,
      //   newPassword: password1,
      //   token,
      // });
      // TODO: Make ajax call as shown above and delete mock response below.
      const response = await Promise.resolve({
        error: undefined,
        data: {},
      });

      const { error } = response;
      return {
        error,
      };
    };
  },

  forgotPassword({ email }) {
    return async dispatch => {
      // const response = await authPost("/api/auth/password/forgot", {
      //   email,
      // });
      // TODO: Make ajax call as shown above and delete mock response below.
      const response = await Promise.resolve({
        error: undefined,
        data: {},
      });
      return response;
    };
  },

  login({ email, password }) {
    return async dispatch => {
      dispatch({ type: type.LOGIN_REQUEST });
      dispatch(UIActions.setUILoading(true));
      // const response = await authPost("/api/auth/login", {
      //   userName: email,
      //   password,
      // });
      // TODO: Make ajax call as shown above and delete mock response below.
      const response = await Promise.resolve({
        error: undefined,
        data: {
          // Mock token created at https://jwt.io/
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzciLCJuYW1lIjoic2FtcGxldXNlckBzYW1wbGVjb21wYW55LmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZXMiOlsidXNlciJdfQ.Jy5RtExl6b1mwKMWpd9jIIV9v2JZhicb8SCeSYVTZ7s",
          expiration: new Date(
            new Date().getFullYear() + 1,
            0,
            1,
          ).toISOString(),
          email: "demouser@gmail.com",
          company: { id: 999, name: "Demo Company" },
          user: { id: 777, firstName: "Demo", lastName: "User" },
        },
      });
      const { error } = response;
      if (error) {
        dispatch({
          type: type.LOGIN_FAILURE,
          error,
        });
        dispatch(UIActions.setUILoading(false));
        return {
          error,
        };
      }
      const data = response.data;
      const { token, expiration } = data;
      setAuthRequestToken(token, expiration);
      dispatch({
        type: type.LOGIN_SUCCESS,
        data,
      });
      // NOT setting loading false here, whole page will be reloaded.
      // dispatch(UIActions.setUILoading(false));
      return {
        data,
      };
    };
  },

  logout() {
    return async dispatch => {
      dispatch({ type: type.LOGOUT_REQUEST });

      // HACK: Clear local storage since redux-persist isn't persisting this
      // even when running as a PWA...
      localStorage.clear();

      // CONSIDER: Tell the server that we're logging out so it can blacklist
      // the token until it expires...
      // const response = await authPost("/logout");
      // TODO: Make ajax call as shown above or delete mock response below.
      const response = await Promise.resolve({
        error: undefined,
        data: {},
      });

      dispatch({ type: type.LOGOUT_SUCCESS, data: response.data });
      removeAuthRequestToken();
      return { error: undefined };
    };
  },

  resetPassword({ email, token, password1, password2 }) {
    return async dispatch => {
      // const response = await authPost("/api/auth/password/reset", {
      //   email,
      //   newPassword: password1,
      //   token,
      // });
      // TODO: Make ajax call as shown above and delete mock response below.
      const response = await Promise.resolve({
        error: undefined,
        data: {},
      });
      const { error } = response;
      return {
        error,
      };
    };
  },
};
