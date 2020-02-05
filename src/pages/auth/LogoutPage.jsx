import React from "react";
// Local
import { useOnMount } from "../../lib";
import { connectView, AuthActions } from "../../state";

function _LogoutPage({ actions: { logout } }) {
  async function logoutAndRedirect() {
    await logout();
    window.location.replace("/auth/login");
  }

  useOnMount(() => {
    logoutAndRedirect();
  });
  return <h2>Logging out...</h2>;
}

export const LogoutPage = connectView(_LogoutPage, [AuthActions]);
