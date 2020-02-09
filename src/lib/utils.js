import { format as dateFormatter } from "date-fns";

export { default as arrayMove } from "array-move";

/**
 * Returns `value + addValue` if `value` is truthy, else `defaultValue`.
 * @param {any} value Value to evaluate.
 * @param {any} addValue Added to `value` if `value` not falsey.
 * @param {any} defaultValue The default value to return if `value` is falsey.
 */
export function addIf(value, addValue, defaultValue = "") {
  return value ? value + addValue : defaultValue;
}
/**
 * Converts an array to an object indexed by id.
 * @param {{id:any}[]} arr
 * @param {object[]} [sortIdArr] Array to save sorted ids.
 */
export function arrayToObjectById(arr, sortIdArr) {
  const obj = {};
  const len = arr.length;
  if (sortIdArr) {
    for (let i = 0; i < len; i++) {
      const item = arr[i];
      const id = item.id;
      obj[id] = item;
      sortIdArr.push(id);
    }
  } else {
    for (let i = 0; i < len; i++) {
      const item = arr[i];
      const id = item.id;
      obj[id] = item;
    }
  }
  return obj;
}
/** Returns 'yes' if `bool` is true, otherwise 'no'. */
export function boolYesNo(bool) {
  return bool ? "yes" : "no";
}
/**
 * Simple debounce function
 * @param {Function} fn Function to call after the `delay`.
 * @param {number} delay Time in milliseconds.
 */
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearInterval(timeoutId);
    timeoutId = setTimeout(fn, delay, ...args);
  };
}
/**
 * Converts a decimal percentage to an integer percentage.
 * @param {number} value
 */
export function decimalToPercent(value) {
  return parseFloat(value) * 100;
}
/** An empty function. */
export function emptyHandler() {}
/** Flattens nested objects and arrays into a single dimension object.
 * See https://stackoverflow.com/questions/54896928/flattening-the-nested-object-in-javascript
 */
export function flatten(obj, prefix = "", res = {}) {
  return Object.entries(obj).reduce((r, [key, val]) => {
    const k = `${prefix}${key}`;
    if (typeof val === "object") {
      flatten(val, `${k}.`, r);
    } else {
      res[k] = val;
    }
    return r;
  }, res);
}
/**
 * Formats `amount` in standard USD format.
 * - This was used instead of `Intl.NumberFormat` since the polyfill for that is
 * huge and we don't want to use a third-party polyfill.io service for a
 * financial app.
 * - See https://stackoverflow.com/a/149099/16387
 * - Removed decimal option.
 * - Added dollar sign option.
 * - Converted options to a single object argument.
 * @param {number} amount
 * @param {{decimalCount:number,dollarSign:string,thousands:string}} [options]
 * @param {number} [options.decimalCount] Number of decimals to display. (`2`)
 * @param {string} [options.dollarSign] Dollar sign to display. (`"$"`)
 * @param {string} [options.thousands] Thousands separator. (`","`)
 */
export function formatAmountUSD(amount, options) {
  let decimalCount = 2,
    dollarSign = "$",
    thousands = ",";
  if (options) {
    if (options.decimalCount) decimalCount = options.decimalCount;
    if (options.dollarSign) dollarSign = options.dollarSign;
    if (options.thousands) thousands = options.thousands;
  }
  decimalCount = Math.abs(decimalCount);
  decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

  const negativeSign = amount < 0 ? "-" : "";

  let i = parseInt(
    (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
  ).toString();
  let j = i.length > 3 ? i.length % 3 : 0;

  return (
    dollarSign +
    negativeSign +
    (j ? i.substr(0, j) + thousands : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
    (decimalCount
      ? "." +
        Math.abs(amount - i)
          .toFixed(decimalCount)
          .slice(2)
      : "")
  );
}

export function formatDate(date, format = "MM/dd/yyyy") {
  if (!date) {
    return "";
  }
  return dateFormatter(new Date(date), format);
}
export function formatDateLong(date, format = "LLLL dd, yyyy") {
  if (!date) {
    return "";
  }
  return dateFormatter(new Date(date), format);
}
export function formatHours(hours, suffix = "") {
  return (hours || 0).toFixed(2) + suffix;
  // return (hours || 0).toString() + suffix;
}
/** @param {string} value The phone number. */
export function formatPhone(value) {
  var cleaned = getPhoneNumbersOnly(value);
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
}
/** @param {string} value */
export function getPhoneNumbersOnly(value) {
  return ("" + (value || "")).replace(/\D/g, "");
}
/**
 * Returns true if the given `date` is a valid `Date` object.
 * @param {Date} date
 */
export function isDateValid(date) {
  return date instanceof Date && !isNaN(date);
}
/** True if the given `str` is 'yes'. (Case insensitive) */
export function isYes(str) {
  return ("" + str).toLowerCase() === "yes" ? true : false;
}
/**
 * Converts the given value to lower camel case.
 * @param {string} value
 */
export function lowerCamelCase(value) {
  if (!value) {
    return "";
  }
  return value.substr(0, 1).toLowerCase() + value.substr(1);
}
/**
 * Returns an array of values from a map of values, by key.
 * The opposite of `arrayToObjById`.
 * @param {{ [key:string]:any }} obj Map of values by key.
 */
export function mapToArray(obj) {
  return Object.keys(obj).map(key => obj[key]);
}
/**
 * Returns the given string value with numbers masked by an asterisk, if
 * `shouldMask` is true.
 * @param {boolean} shouldMask
 * @param {string} value
 */
export function maskNumbersIf(shouldMask, value) {
  return shouldMask ? ("" + value).replace(/[0-9]/g, "*") : value;
}
/**
 * Masks all characters up to the last 4.
 * @param {string} value
 * @param {number} [maskLen] Optional number of mask characters. If passed, this
 * number will be used instead of detecting how many characters came before the
 * last 4.
 */
export function maskUpToLast4(value, maskLen) {
  value = "" + value;
  var lengthBeforeLast4 = Math.max(0, value.length - 4);
  var last4 = value.substr(lengthBeforeLast4);
  var mask = "*".repeat(maskLen || lengthBeforeLast4);
  return mask + last4;
}
/**
 * Returns a CSS `hsl` color string hashed from the given `str`.
 * @param {string} str The input string.
 * @param {number} saturation Percentage of saturation (`0 - 100`).
 * Use a value around `30` for pastels.
 * @param {number} lightness Percentage of lightness (`0 - 100`).
 * Use a value around `80` for pastels.
 *
 * @see https://medium.com/%40pppped/compute-an-arbitrary-color-for-user-avatar-starting-from-his-username-with-javascript-cd0675943b66
 * @see https://codepen.io/sergiopedercini/pen/RLJYLj/
 */
export function stringToHslColor(str, saturation, lightness) {
  const { length } = str || "";
  let hash = 0;
  for (let i = 0; i < length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = hash % 360;
  return `hsl(${color},${saturation}%,${lightness}%)`;
}
/**
 * Returns a pastel CSS `hsl` color string hashed from the given `str`.
 * @param {string} str The input string.
 * @see `stringToHslColor`
 */
export function stringToHslPastel(str) {
  return stringToHslColor(str, 30, 80);
}
/**
 * Asynchronously waits for the given amount of time in `ms`.
 * @param {number} [ms] Time to wait, in milliseconds.
 */
export function timeoutAsync(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
