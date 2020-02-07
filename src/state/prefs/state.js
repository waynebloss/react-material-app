import { createSlice } from "@reduxjs/toolkit";
// Local
import { AuthActions } from "../auth/state";

const initialState = {
  hidePay: true,
  hideInfo: true,
};
/**
 * Preferences state (**persisted**).
 * @example
 * {
 *    hidePay: true,
 *    hideInfo: true,
 * }
 */
const prefs = createSlice({
  name: "prefs",
  initialState,
  reducers: {
    updatePrefs(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  extraReducers: {
    [AuthActions.loggedOut]() {
      return initialState;
    },
  },
});

const { updatePrefs } = prefs.actions;

export const PrefsActions = {
  updatePrefs,
  /** @param {boolean} hideInfo */
  updateHideInfo(hideInfo) {
    return updatePrefs({ hideInfo });
  },
  /** @param {boolean} hidePay */
  updateHidePay(hidePay) {
    return updatePrefs({ hidePay });
  },
};

export const PrefState = {
  ...prefs,
  persist: true,
};
