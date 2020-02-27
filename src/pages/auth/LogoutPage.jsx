import React from "react";
// Local
import { useOnMount } from "../../lib";
import { AuthActions, useDispatch } from "../../state";

function _LogoutPage() {
  const dispatch = useDispatch();
  async function logoutAndRedirect() {
    await dispatch(AuthActions.logout());
    window.location.replace("/auth/login");
  }

  useOnMount(() => {
    logoutAndRedirect();
  });
  return <h2>Logging out...</h2>;
}

export const LogoutPage = React.memo(_LogoutPage);
