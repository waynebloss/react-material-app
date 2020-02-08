import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import {
  KEY_PREFIX,
  persistCombineReducers,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
// #region Optional Imports - If enabled, uncomment related code as well.
//
// import { createLogger } from "redux-logger";
// import crossTabSync from "redux-persist-crosstab";
//
// #endregion
// Local
import { __DEV__, REACT_APP_PERSIST_KEY } from "../config";
import appStates from "./states";

/** Returns a `reducer` function from the `handlers` property of the given
 * `reducerSpec`.
 * @param {ReducerSpec} reducerSpec
 * @returns {Reducer}
 */
function reducerOf(reducerSpec) {
  const { defaults = {}, handlers = {}, reducer } = reducerSpec;
  if (reducer) return reducer;
  function autoReducer(state, action) {
    const actionType = action.type;
    const handler = handlers[actionType];
    if (!handler) return state || defaults;
    return handler(state, action);
  }
  return autoReducer;
}

/** Map of appState reducers. */
const reducerMap = (function mapStates() {
  /** Slice names to purge from storage when `purgeStore` is called. */
  const defaultPurgeKeys = [];
  /** Slice names to prevent from storage. */
  const noPersist = [];
  /** Each sub-reducer function by slice name. */
  const reducers = {};
  /** States preloaded from localStorage by slice name. */
  let preloadedState;

  // Preload state
  const storageObject = (function preloadState() {
    // This is only possible since we're using localStorage which we can access
    // synchronously. It's simpler than using `redux-persist/PersistGate`.
    const persistKey = REACT_APP_PERSIST_KEY || "app";
    const storageKey = `${KEY_PREFIX}${persistKey}`;
    const storageValue = localStorage.getItem(storageKey);
    return storageValue ? JSON.parse(storageValue) : undefined;
  })();

  appStates.forEach(appState => {
    const {
      name,
      persist: shouldPersist = false,
      preload: shouldPreload = true,
      purge: shouldPurge = true,
    } = appState;
    if (!shouldPersist) {
      noPersist.push(name);
    } else if (shouldPreload && storageObject && storageObject[name]) {
      if (preloadedState === undefined) preloadedState = {};
      preloadedState[name] = JSON.parse(storageObject[name]);
    }
    if (shouldPurge && shouldPersist) {
      defaultPurgeKeys.push(name);
    }
    reducers[name] = reducerOf(appState);
  });
  return {
    defaultPurgeKeys,
    noPersist,
    reducers,
    preloadedState,
  };
})();

/** Configuration to persist the store to localStorage. */
const persistConfig = {
  blacklist: reducerMap.noPersist,
  debug: __DEV__,
  key: process.env.REACT_APP_PERSIST_KEY || "reduxPersist",
  storage,
};

/** The main reducer that calls all other reducers. */
const rootReducer = persistCombineReducers(persistConfig, reducerMap.reducers);

function composeStoreEnhancer(config) {
  const { logger, middlewares, thunk } = config;
  // #region Assemble middleware.
  var toApply = [];
  if (middlewares) {
    toApply = toApply.concat(middlewares);
  }
  // Thunk should probably be last, but before logger.
  // See https://github.com/reduxjs/redux-thunk/issues/134
  if (thunk) {
    toApply.push(thunk);
  }
  // Logger must be LAST.
  // See https://github.com/evgenyrodionov/redux-logger#usage
  if (logger) {
    toApply.push(logger);
  }
  const middlewareEnhancer = applyMiddleware(
    // ORDER: LEFT-TO-RIGHT - The FIRST middleware in toApply is executed FIRST.
    ...toApply,
  );
  // #endregion
  // #region Compose enhancers into one store enhancer.
  // Using Redux compose [1] or composeWithDevTools [2].
  // [1] https://redux.js.org/api-reference/compose
  // [2] https://github.com/zalmoxisus/redux-devtools-extension
  return composeWithDevTools(
    // ORDER: RIGHT-TO-LEFT - The RIGHT-most/BOTTOM enhancer is executed FIRST.
    middlewareEnhancer,
  );
  // #endregion
}

const storeEnhancer = composeStoreEnhancer({
  // logger:
  //   __DEV__ && process.env.REACT_APP_ENABLE_REDUX_LOGGER === true
  //     ? createLogger() // Import from "redux-logger" to use this.
  //     : undefined,
  thunk,
  // middlewares: [
  //   // NOTE: Pass custom `import middleware from './middleware';` here. e.g.:
  //   ...middleware
  // ],
});

export const store = createStore(
  rootReducer,
  reducerMap.preloadedState,
  storeEnhancer,
);
export default store;

export const persistor = persistStore(store);
// Optional import:
// crossTabSync(store, persistConfig);

/** Purge persisted store state of the given `keys`.
 * **If no `keys` are passed, ALL states specced with `purge:true` are purged.**
 * @param {string[]} [keys] The keys to remove.
 */
export function purgeStore(keys = reducerMap.defaultPurgeKeys) {
  persistor.purge(keys);
}

/**
 * @typedef {(state: StateObj, action: ActionObj)=> StateObj} Reducer Redux
 * reducer function.
 *
 * @typedef {object} ReducerSpec Specification for creating a Redux reducer from
 * an object.
 * @property {StateObj} [defaults] The default values for reducer to return.
 * @property {{[ACTION_TYPE: string]: ()=> Reducer}} [handlers]
 * @property {Reducer} [reducer] A reducer to use instead of creating one from
 * `handlers`.
 *
 */
