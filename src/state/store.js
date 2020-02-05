import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { persistCombineReducers, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
// #region Optional Imports - If enabled, uncomment related code as well.
//
// import { createLogger } from "redux-logger";
// import crossTabSync from "redux-persist-crosstab";
//
// #endregion
import { mapReducersOf } from "../lib/reducers";
import appStates from "./states";

// #region Redux Setup Notes
//
// ## Feature middleware, then core middleware
// - https://github.com/thinking-in-redux/thinking-in-redux-book-samples/blob/07_naming_conventions_and_project_structure/src/redux/store.js
//
// ## Redux-thunk middleware should probably be last, but before logger
// - https://github.com/reduxjs/redux-thunk/issues/134
// - https://github.com/evgenyrodionov/redux-logger#usage
//
// ## Redux-persist v5 example setup at:
// https://github.com/rt2zz/redux-persist/issues/99#issuecomment-340224008
// ...
// #endregion

const __DEV__ = process.env.NODE_ENV === "development";
/** Map of reducer meta-data and reducer functions. */
const reducerMap = mapReducersOf(appStates);
/** Configuration to persist the store to localStorage. */
const persistConfig = {
  blacklist: reducerMap.noPersist,
  debug: __DEV__,
  key: process.env.REACT_APP_PERSIST_KEY || "reduxPersist",
  storage,
};
/** The main reducer that calls all other reducers. */
const rootReducer = persistCombineReducers(persistConfig, reducerMap.reducers);
/** The current redux persistor.
 * @type {import('redux-persist').Persistor}
 */
let persistor;

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
  // #region CONSIDER: Buffer actions until rehydrate occurs.
  // Right now I don't think we're having any issues [1, 2] by NOT buffering,
  // since we preload the state manually (so the *initial* rehydrate doesn't
  // cause any changes in the state...)
  // NOTE: We just upgraded to redux-persist v5, so this concern might no longer
  // be applicable.
  // SEE ALSO: PersistGate from redux-persist.
  // [1] https://github.com/rt2zz/redux-persist/issues/226
  // [2] https://github.com/rt2zz/redux-persist/issues/189
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

/** Starts the process of persisting and syncing the store. */
export function activateStore() {
  function activatingStore(resolve, reject) {
    function persistStoreCompleted() {
      resolve(store);
    }
    persistor = persistStore(store, null, persistStoreCompleted);
    // Import from "redux-persist-crosstab" to use this:
    // crossTabSync(store, persistConfig);
  }
  return new Promise(activatingStore);
}

export const store = createStore(
  rootReducer,
  reducerMap.preloadedState,
  storeEnhancer,
);
export default store;

/** Purge persisted store state of the given `keys`.
 * **If no `keys` are passed, ALL states specced with `purge:true` are purged.**
 * @param {string[]} [keys] The keys to remove.
 */
export function purgeStore(keys = reducerMap.defaultPurgeKeys) {
  persistor.purge(keys);
}
