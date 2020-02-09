import { AuthState } from "./auth/state";
import { PrefState } from "./prefs/state";
import { TodoState } from "./todos/state";
import { UIState } from "./ui/state";

// Export Actions, Selectors

export * from "./auth/actions";
export * from "./auth/selectors";

export * from "./prefs/actions";
export * from "./prefs/selectors";

export * from "./todos/actions";
export * from "./todos/selectors";

export * from "./ui/actions";
export * from "./ui/selectors";

export default [
  // Export States
  AuthState,
  PrefState,
  TodoState,
  UIState,
];
