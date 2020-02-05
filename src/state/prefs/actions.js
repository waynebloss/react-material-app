const type = {
  PREFS_UPDATE: "PREFS_UPDATE",
};

export const PrefActions = {
  type,

  /** @param {boolean} hideInfo */
  updateHideInfo(hideInfo) {
    return { type: type.PREFS_UPDATE, hideInfo };
  },
  /** @param {boolean} hidePay */
  updateHidePay(hidePay) {
    return { type: type.PREFS_UPDATE, hidePay };
  },
  /**
   * Updates the given `prefs`.
   * @param {{hidePay?:boolean}} prefs
   */
  updatePrefs(prefs) {
    return { type: type.PREFS_UPDATE, ...prefs };
  },
};
