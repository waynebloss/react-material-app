/** @file Async activity tracking and "cancellation" functions.
 *
 * There is no built-in way to cancel `async/await` or ES6 `Promise`
 * activities. So, what happens when your code is waiting for an async response
 * and then the user navigates to a different view in your app? There could be
 * an error such as "Can't call setState (or forceUpdate) on an unmounted
 * component" or your code might process a response in some other way when it
 * should have been cancelled.
 *
 * Using the functions in this file, you can track async activities, cancel them
 * and detect whether they've been cancelled.
 *
 * To track async activities, use the high level `trackAsync` or `trackFetch`
 * functions. See examples of each in this file.
 *
 * To cancel all async activities, use `cancelAllAsync`.
 *
 * Lower level tracking and cancellation functions are `beginAsync`,
 * `cancelAsyncById` and `endAsyncById`.
 */

/** Map of currently running async activity ids. */
let activityById = {
  // { 1: true, 2: true, ...}
};
/** The next async activity id to assign. */
let nextActivityId = 1;

/** Creates a new activity id, starts tracking it and returns an activity
 * handle, which can be used to cancel or signal the end of the activity.
 * @returns {{id:number, cancel: ()=> void, end: ()=> boolean}} An activity
 * handle that can be used to cancel or end the activity.
 * @example
 * const act = beginAsync();
 * const value = await asyncFunction();
 * // Outside code might call `cancelAllAsync` while we await `asyncFunction`...
 * const cancelled = !act.end();
 */
export function beginAsync() {
  const id = nextActivityId;
  nextActivityId += 1;
  activityById[id] = true;
  return {
    /** Unique id (in memory) for the async activity. */
    id,
    /** Ends tracking the async activity. */
    cancel() {
      delete activityById[id];
    },
    /** Ends tracking the async activity. Returns `true` on success or `false`
     * if already ended or cancelled. */
    end() {
      const exists = activityById[id];
      delete activityById[id];
      return !!exists;
    },
  };
}
/** Cancels ALL current async activities. */
export function cancelAllAsync() {
  activityById = {};
}
/** Cancels the given activity id.
 * @param {number} id The activity id.
 */
export function cancelAsyncById(id) {
  delete activityById[id];
}
/** Ends tracking the activity id. Returns `true` on success or `false` if
 * the activity had already ended or was cancelled.
 * @param {number} id The activity id.
 * @returns {boolean} `true` for success, `false` if already ended / cancelled.
 */
export function endAsyncById(id) {
  const exists = activityById[id];
  delete activityById[id];
  return !!exists;
}
/** Simulates async activity by setting a cancellable async timeout that
 * resolves with the given result.
 * @param {number} timeout The timeout time in milliseconds.
 * @param {object} result The result object to return along with a new field,
 * `cancelled:boolean`.
 * @returns An object with a `cancelled` field and any fields from `result`.
 */
export function simulateAsync(timeout, result = {}) {
  const act = beginAsync();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cancelled = !act.end();
      resolve({
        ...result,
        cancelled,
      });
    }, timeout);
  });
}
/** Tracks an async function for cancellation.
 * @returns {Promise<{cancelled:boolean, value:any}>}
 * Result value and cancelled boolean.
 * @example
 * const result = await trackAsync(doAsyncThing());
 * if (result.cancelled) { console.log('CANCELLED'); }
 * else { console.log('VALUE: ', result.value); }
 */
export async function trackAsync(asyncFunction) {
  const act = beginAsync();
  const value = await asyncFunction();
  const cancelled = !act.end();
  return {
    cancelled,
    value,
  };
}
/** Track an async fetch for cancellation.
 * @returns {Promise<{cancelled:boolean, response:Response}>
 * Response and cancelled boolean.
 * @example
 * const result = await trackFetch(fetch(url, {
 *   method: 'POST',
 *   body: JSON.stringify(data)
 * }));
 * if (result.cancelled) { console.log('CANCELLED'); }
 * else { console.log('RESPONSE: ', result.response); }
 */
export async function trackFetch(fetch) {
  const act = beginAsync();
  const response = await fetch();
  const cancelled = !act.end();
  return {
    cancelled,
    response,
  };
}
