import { formatAmountUSD, maskNumbersIf } from "../../lib";

export function preferHidePay(state) {
  const {
    prefs: { hidePay },
  } = state;
  return {
    preferHidePay: !!hidePay,
  };
}

export function preferHideInfo(state) {
  const {
    prefs: { hideInfo },
  } = state;
  return {
    preferHideInfo: !!hideInfo,
  };
}

export function renderAmount(state) {
  const {
    prefs: { hidePay },
  } = state;
  return {
    renderAmount(value = 0) {
      const amount = formatAmountUSD(value);
      return maskNumbersIf(hidePay, amount);
    },
  };
}

export function renderPrivateNum(state) {
  const {
    prefs: { hideInfo },
  } = state;
  return {
    renderPrivateNum(value = "") {
      return maskNumbersIf(hideInfo, value);
    },
  };
}
