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

// Preload state
// This is only possible since we're using localStorage which we can access
// synchronously. It's simpler than using `redux-persist/PersistGate`.
const persistKey = REACT_APP_PERSIST_KEY || "app";
const storageKey = `${KEY_PREFIX}${persistKey}`;
const storageValue = localStorage.getItem(storageKey);
const storageObject = storageValue ? JSON.parse(storageValue) : undefined;

// Map appState reducers.
const reducerMap = (function mapStates() {
  const defaultPurgeKeys = [];
  const noPersist = [];
  const reducers = {};
  let preloadedState;

  appStates.forEach(reducerSpec => {
    const { name, persist: shouldPersist, purge: shouldPurge } = reducerSpec;
    if (!shouldPersist) {
      noPersist.push(name);
    } else if (storageObject && storageObject[name]) {
      if (preloadedState === undefined) preloadedState = {};
      preloadedState[name] = JSON.parse(storageObject[name]);
    }
    if (shouldPurge || (shouldPurge === undefined && shouldPersist)) {
      defaultPurgeKeys.push(name);
    }
    reducers[name] = reducerSpec.reducer;
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
