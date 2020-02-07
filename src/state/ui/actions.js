/** @file This is just an experiment to define actions in a separate file. */

import { ui } from "./state";

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
