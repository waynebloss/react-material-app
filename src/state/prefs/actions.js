const type = {
  PREFS_UPDATE: "PREFS_UPDATE",
  PREFS_DIALOGEDIT_TOGGLE: "PREFS_DIALOGEDIT_TOGGLE",
};

export const PrefActions = {
  type,

  toggleDialogEdit() {
    return { type: type.PREFS_DIALOGEDIT_TOGGLE };
  },
};
