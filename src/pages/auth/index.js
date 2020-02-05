import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { LoginPage } from "./LoginPage";
import { LogoutPage } from "./LogoutPage";
import { ResetPasswordPage } from "./ResetPasswordPage";

import { AuthAreaLayout } from "../../layouts";

export const AuthPages = {
  confirmAccount: {
    anon: true,
    path: "/auth/confirm-account",
    title: "Confirm Acount",
    type: "PAGE_CONFIRM_ACCOUNT",
    view: ResetPasswordPage,
    layout: "auth",
  },
  login: {
    anon: true,
    path: "/auth/login",
    title: "Login",
    type: "PAGE_LOGIN",
    view: LoginPage,
    layout: "auth",
  },
  logout: {
    anon: true,
    path: "/auth/logout",
    title: "Logout",
    type: "PAGE_LOGOUT",
    view: LogoutPage,
    layout: "auth",
  },
  forgotPassword: {
    anon: true,
    path: "/auth/forgot-password",
    title: "Forgot Password",
    type: "PAGE_FORGOT_PASSWORD",
    view: ForgotPasswordPage,
    layout: "auth",
  },
  resetPassword: {
    anon: true,
    path: "/auth/reset-password",
    title: "Reset Password",
    type: "PAGE_RESET_PASSWORD",
    view: ResetPasswordPage,
    layout: "auth",
  },
};
export default AuthPages;

export const AuthArea = {
  pages: AuthPages,
  layouts: {
    auth: {
      path: "/auth",
      view: AuthAreaLayout,
    },
  },
};
