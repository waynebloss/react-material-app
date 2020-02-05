const type = {
  UI_LOADING_SET: "UI_LOADING_SET",
  UI_NOTIFICATION_SHOW: "UI_NOTIFICATION_SHOW",
  UI_NOTIFICATION_HIDE: "UI_NOTIFICATION_HIDE",
};

export const UIActions = {
  type,

  hideNotification() {
    return { type: type.UI_NOTIFICATION_HIDE };
  },

  setUILoading(value) {
    return { type: type.UI_LOADING_SET, value };
  },

  showError(message = "There was an error processing your request.") {
    return UIActions.showNotification(message, "error");
  },

  showNotification(message, variant, duration) {
    if (duration === undefined && variant !== "error") {
      duration = 15000;
    }
    return { type: type.UI_NOTIFICATION_SHOW, message, variant, duration };
  },

  showUpdated(message = "Your changes have been submitted.") {
    return UIActions.showNotification(message);
  },
};
