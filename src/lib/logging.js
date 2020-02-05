import { captureException, withScope } from "@sentry/browser";
// Local
import { flatten } from "./utils";

/**
 * Logs an error with optional context.
 * @param {ErrorType} error
 * @param {ErrorContext} [context]
 */
export function logError(error, context) {
  if (!context) {
    captureException(error);
    return;
  }
  withScope(scope => {
    if (context.tags) {
      scope.setTags(context.tags);
    }
    if (context.extra) {
      scope.setExtras(flatten(context.extra));
    }
    captureException(error);
  });
}

/**
 * @typedef {Error|string} ErrorType
 *
 * @typedef {object} ErrorContext
 * @property {{[name:string]:string}} [tags] Key/value tags.
 * @property {{[name:string]:string}} [extra] Key/value extra fields.
 */
