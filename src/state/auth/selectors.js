import { stringToHslPastel } from "../../lib";

export function accountEmail(state) {
  const {
    auth: { email },
  } = state;
  return {
    accountEmail: email,
  };
}

export function avatarInfo(state) {
  const {
    auth: { user = {} },
  } = state;
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const wholeName = (firstName + " " + lastName).trim();
  const initials = firstName.substring(0, 1) + lastName.substring(0, 1);
  return {
    avatarInfo: {
      bgColor: stringToHslPastel(wholeName),
      text: initials,
      textColor: "#fff",
    },
  };
}

export function userFirstName(state) {
  const {
    auth: { user },
  } = state;
  return {
    userFirstName: user && user.firstName,
  };
}

export function userLastName(state) {
  const {
    auth: { user },
  } = state;
  return {
    userLastName: user && user.lastName,
  };
}

export function userFullName(state) {
  const {
    auth: { user = {} },
  } = state;
  return {
    userFullName: `${user.firstName} ${user.lastName}`.trim(),
  };
}
