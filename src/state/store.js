import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  KEY_PREFIX,
  persistCombineReducers,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// Local
import { __DEV__, REACT_APP_PERSIST_KEY } from "../config";
import appStates from "./states";

const persistKey = REACT_APP_PERSIST_KEY || "app";

// Map appState reducers.
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
    reducers[name] = appState.reducer;
  });
  return {
    defaultPurgeKeys,
    noPersist,
    reducers,
    preloadedState,
  };
})();

const rootReducer = persistCombineReducers(
  {
    blacklist: reducerMap.noPersist,
    debug: __DEV__,
    key: persistKey,
    storage,
  },
  reducerMap.reducers,
);

export const store = configureStore({
  middleware: getDefaultMiddleware({ serializableCheck: false }),
  preloadedState: reducerMap.preloadedState,
  reducer: rootReducer,
});

export const persistor = persistStore(store);

/** Purge persisted store state of the given `keys`.
 * **If no `keys` are passed, ALL states specced with `purge:true` are purged.**
 * @param {string[]} [keys] The keys to remove.
 */
export function purgeStore(keys = reducerMap.defaultPurgeKeys) {
  persistor.purge(keys);
}
