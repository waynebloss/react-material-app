import { stringToHslPastel } from "../../lib";

export const AuthSelectors = {
  accountEmail(state) {
    return state.auth?.email ?? "";
  },
  avatarInfo(state) {
    const {
      auth: { user = {} },
    } = state;
    const firstName = user.firstName ?? "";
    const lastName = user.lastName ?? "";
    const wholeName = (firstName + " " + lastName).trim();
    const initials = firstName.substring(0, 1) + lastName.substring(0, 1);
    return {
      bgColor: stringToHslPastel(wholeName),
      text: initials,
      textColor: "#fff",
    };
  },
  userFirstName(state) {
    return state.auth?.user?.firstName ?? "";
  },
  userFullName(state) {
    const {
      auth: { user = {} },
    } = state;
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  },
  userLastName(state) {
    return state.auth?.user?.lastName;
  },
};
