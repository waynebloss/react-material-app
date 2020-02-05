export function uiLoading(state) {
  const {
    ui: { loading },
  } = state;
  return {
    uiLoading: loading,
  };
}

export function uiNotification(state) {
  const {
    ui: { notification },
  } = state;
  return {
    uiNotification: notification,
  };
}
