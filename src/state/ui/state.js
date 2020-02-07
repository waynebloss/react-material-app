import { createSlice } from "@reduxjs/toolkit";

/**
 * UI state (**NOT** persisted).
 * @example
 * {
 *    loading: false,
 *    notification: { duration: number, message: string, variant: "" | "error" }
 * }
 */
const ui = createSlice({
  name: "ui",
  initialState: {
    loading: false,
  },
  reducers: {
    setUILoading(state, { payload }) {
      state.loading = payload;
    },
    hideNotification(state) {
      state.notification = undefined;
    },
    showNotification: {
      reducer(state, { payload }) {
        state.notification = payload;
      },
      prepare(message, variant, duration) {
        if (duration === undefined && variant !== "error") {
          duration = 15000;
        }
        return {
          message,
          duration,
          variant,
        };
      },
    },
  },
});
// ui.persist = false;

const { setUILoading, hideNotification, showNotification } = ui.actions;

export const UIActions = {
  setUILoading,
  hideNotification,
  showNotification,

  showError(message = "There was an error processing your request.") {
    return showNotification(message, "error");
  },

  showUpdated(message = "Your changes have been submitted.") {
    return showNotification(message);
  },
};

export const UIState = {
  ...ui,
  persist: false,
};
