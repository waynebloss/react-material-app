export function preferDialogEdit(state) {
  const {
    prefs: { dialogEdit },
  } = state;
  return {
    preferDialogEdit: !!dialogEdit,
  };
}
