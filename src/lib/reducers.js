/** Optionally compose 2 reducers so that the `reducerToInject` (if any) is
 * called before the given `reducer`.
 * @param {Reducer} reducer
 * @param {Reducer} [reducerToInject]
 */
export function maybeInjectReducer(reducer, reducerToInject) {
  if (typeof reducerToInject !== "function") {
    return reducer;
  }
  return function injectedReducer(state, action) {
    state = reducerToInject(state, action);
    return reducer(state, action);
  };
}
/**
 * Load persisted reducer state data from localStorage.
 * @param {string} reducerName Name of the reducer to load data for.
 */
export function preloadReducerState(reducerName) {
  let json = localStorage.getItem(
    `persist:${process.env.REACT_APP_PERSIST_KEY || "reduxPersist"}`,
  );
  if (!json) {
    return undefined;
  }
  const root = JSON.parse(json) || {};
  json = root[reducerName];
  if (!json) {
    return undefined;
  }
  const loadedData = JSON.parse(json);
  return loadedData;
}
/** Returns the `reducer` of the given `reducerSpec` or creates one from its
 * `handlers` and `defaults` properties.
 * @param {ReducerSpec} reducerSpec
 * @returns {Reducer}
 */
export function reducerOf(reducerSpec) {
  const { defaults = {}, handlers = {}, reducer } = reducerSpec;
  if (reducer) return reducer;
  function autoReducer(state, action) {
    const actionType = action.type;
    const handler = handlers[actionType];
    if (typeof handler !== "function") return state || defaults;
    const newState = handler(state, action);
    return newState || state || defaults;
  }
  return autoReducer;
}
/** Returns a map of reducers created from and meta-data gathered from the given
 * `reducerSpecs`.
 * @param {ReducerSpec[]} reducerSpecs
 * @param {Preloader} preload
 * @returns {ReducerSpecMap}
 */
export function mapReducersOf(reducerSpecs, preload = preloadReducerState) {
  const defaultPurgeKeys = [];
  const noPersist = [];
  const reducers = {};
  let preloadedState;

  reducerSpecs.forEach(function prepareReducer(reducerSpec) {
    const {
      name,
      persist: shouldPersist,
      preload: shouldPreload,
      purge: shouldPurge,
    } = reducerSpec;
    let loadedData;
    if (!shouldPersist) {
      noPersist.push(name);
    } else if (shouldPreload || shouldPreload === undefined) {
      loadedData = preload(name);
      if (loadedData !== undefined) {
        if (preloadedState === undefined) preloadedState = {};
        preloadedState[name] = loadedData;
      }
    }
    if (shouldPurge || (shouldPurge === undefined && shouldPersist)) {
      defaultPurgeKeys.push(name);
    }
    reducers[name] = reducerOf(reducerSpec);
  });
  return {
    defaultPurgeKeys,
    noPersist,
    reducers,
    preloadedState,
  };
}

// #region Typedefs

/** @typedef {object} ActionObj Redux action object.
 * @property {string} type The action type identifier.
 * @property {object} [payload] The action payload data.
 */

/** @typedef {(reducerName: string)=> object} Preloader Function that preloads reducer state from storage. */

/** @typedef {(state: StateObj, action: ActionObj)=> StateObj} Reducer Redux reducer function. */

/** @typedef {object} ReducerSpec Specification for creating a Redux reducer.
 * @property {StateObj} [defaults] The default values for reducer to return.
 * @property {{[ACTION_TYPE: string]: ()=> Reducer}} [handlers]
 * @property {Reducer} [reducer]
 */

/** @typedef {object} ReducerSpecMap Data returned from mapping a set of `ReducerSpec`s.
 * @property {string[]} defaultPurgeKeys Reducer keys to purge by default, when purging the store.
 * @property {string[]} noPersist Reducer keys that should not be persisted to localStorage.
 * @property {{[key: string]: Reducer}} reducers Map of reducers by name.
 * @property {{[key: string]: object}} [preloadedState] Map of preloaded data for each reducer by name.
 */

/** @typedef {object} StateObj Redux state object.
 * @property {object} [x]
 */

// #endregion
