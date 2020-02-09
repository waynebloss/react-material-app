import React from "react";
import { useMediaQuery } from "@material-ui/core";
// Local
import { debounce } from "./utils";

/**
 * State reducer hook for editing objects by id.
 * @template R
 * @template I
 * @param {{ [action:string]: React.ReducerAction<R> }} [handlers]
 * @param {(I & React.ReducerState<R>)} [initialState]
 * @param {((arg: I & React.ReducerState<R>) => React.ReducerState<R>)} [initializer]
 * @returns {([ I, { [action:string]:(...args:any[])=>any }, React.Dispatch<any> ])}
 */
export function useEditByIdState(handlers, initialState = {}, initializer) {
  // #region Handlers
  const defaultHandlers = {
    replace(state, { id, value }) {
      return {
        ...state,
        [id]: value,
      };
    },
    update(state, { id, value }) {
      return {
        ...state,
        [id]: {
          ...state[id],
          ...value,
        },
      };
    },
    updateAll(state, { values }) {
      return {
        ...state,
        ...values,
      };
    },
    updateField(state, { id, field, value }) {
      return {
        ...state,
        [id]: {
          ...state[id],
          [field]: value,
        },
      };
    },
  };
  if (!handlers) {
    handlers = defaultHandlers;
  } else {
    handlers = {
      ...handlers,
      ...defaultHandlers,
    };
  }
  // #endregion
  const [state, dispatch] = useReducerMap(handlers, initialState, initializer);
  // #region Action Dispatchers
  const actions = {
    replace: useFunction((id, value) =>
      dispatch({ type: "replace", id, value }),
    ),
    update: useFunction((id, value) => dispatch({ type: "update", id, value })),
    updateField: useFunction((id, field, value) =>
      dispatch({ type: "updateField", id, field, value }),
    ),
    updateAll: useFunction(values => dispatch({ type: "updateAll", values })),
  };
  // #endregion
  return [state, actions, dispatch];
}
/**
 * Hook that returns a boolean `hasFocus` value and a set of even handler props
 * (`onFocus`, `onBlur`) to pass to the target element.
 * @param {any} [defaultValue] The default value. (`false`)
 * @example
 *    // Basic usage
 *    const [hasFocus, focusProps] = useFocus();
 *    React.useEffect(() => {
 *      if (hasFocus) {
 *        setOtherValue("");
 *      }
 *    }, [hasFocus, setOtherValue]);
 *    // Rendering:
 *    return (<>
 *      <input type="text" name="myValue" {...focusProps} />
 *      <input type="text" name="otherValue" value={otherValue} />
 *    </>);
 * @example
 *    // Advanced usage
 *    const [hasFocus, focusProps, setHasFocus] = useFocus();
 *    // ... Same as Basic usage, but you can use setHasFocus to change state...
 */
export function useFocus(defaultValue = false) {
  const [hasFocus, setHasFocus] = React.useState(defaultValue);
  const hasFocusProps = {
    onFocus: React.useCallback(
      /** @param {React.SyntheticEvent<HTMLElement>} e */
      function onFocus(e) {
        setHasFocus(true);
      },
      [],
    ),
    onBlur: React.useCallback(
      /** @param {React.SyntheticEvent<HTMLElement>} e */
      function onBlur(e) {
        setHasFocus(false);
      },
      [],
    ),
  };
  return [hasFocus, hasFocusProps, setHasFocus];
}
/**
 * Hook to create a callback hook with `react-hooks/exhaustive-deps` disabled,
 * such as for making a call with `dispatch` from `React.useReducer`.
 * @param {() => void} handler The function that probably uses `dispatch`.
 * See https://reactjs.org/docs/hooks-reference.html#usecallback
 * See https://github.com/reactjs/reactjs.org/issues/1889
 * This function is mainly to provide a better signal to the developer than
 * knowing how `useDispatch` works when you pass an empty array. It also helps
 * get around warnings raised by `react-hooks/exhaustive-deps` and we use it
 * instead of `// eslint-disable-next-line react-hooks/exhaustive-deps`.
 */
export function useFunction(handler) {
  return React.useCallback(handler, []);
}
/**
 * Hook that returns an checkbox value, `onChange` handler and a value setter.
 * Gets the value from `e.currentTarget.checked`.
 * @param {any} [defaultValue] The default value. (`false`)
 * @param {UseInputValueOptions<boolean>} [options]
 *
 * @example
 *   // Basic usage
 *   const [confirmed, onChangeConfirmed] = useInputCheck();
 *   return <input type="checkbox" onChange={onChangeConfirmed} value={confirmed} />;
 * @example
 *   // Advanced usage
 *   const [confirmed, onChangeConfirmed, setEmail] = useInputCheck();
 *   function onClickClearEmail() { setEmail(""); }
 *   return <input type="checkbox" onChange={onChangeConfirmed} value={confirmed} />;
 */
export function useInputCheck(defaultValue = false, options) {
  return useInputValue(defaultValue, {
    valueProp: "checked",
    ...options,
  });
}
/**
 * Hook that returns an input value, debounced value, `onChange` handler and a
 * value setter.
 * @template TValue
 * @param {TValue} [defaultValue] The default value. (`""`)
 * @param {UseInputValueOptions<TValue> | number} options Options or delay in
 * milliseconds.
 * @returns {string[]}
 *
 * @example
 *   // Basic usage
 *   const [email, delayedEmail, onChangeEmail] = useInputValue();
 *   React.useEffect(() => {
 *     console.log("Delayed email changed: ", delayedEmail);
 *   }, [delayedEmail]);
 *   return <input onChange={onChangeEmail} value={email} />;
 */
export function useInputDebounced(defaultValue = "", options) {
  let delay = 1000;
  if (options) {
    if (typeof options === "number") {
      delay = options;
      options = undefined;
    } else if (options.delay) {
      delay = options.delay;
    }
  }
  const [value, onChange, setValue] = useInputValue(defaultValue, options);
  const [debouncedValue, setDebouncedValue] = React.useState(defaultValue);

  const onChangeDebounce = React.useCallback(
    debounce(value => {
      setDebouncedValue(value);
    }, delay),
    [setDebouncedValue],
  );

  React.useEffect(() => {
    onChangeDebounce(value);
  }, [value, onChangeDebounce]);

  return [value, debouncedValue, onChange, setValue];
}
/**
 * Hook that returns an input value, `onChange` handler and a value setter.
 * @template TValue
 * @param {TValue} [defaultValue] The default value. (`""`)
 * @param {UseInputValueOptions<TValue>} options
 * @returns {string[]}
 *
 * @example
 *   // Basic usage
 *   const [email, onChangeEmail] = useInputValue();
 *   return <input onChange={onChangeEmail} value={email} />;
 * @example
 *   // Advanced usage
 *   const [email, onChangeEmail, setEmail] = useInputValue();
 *   function onClickClearEmail() { setEmail(""); }
 *   return <input onChange={onChangeEmail} value={email} />;
 */
export function useInputValue(defaultValue = "", options = {}) {
  const [value, setValue] = React.useState(defaultValue);
  const {
    mapValue,
    valueFromArg = 0,
    valueFrom = "currentTarget",
    valueProp = "value",
  } = options;
  const onChange = React.useCallback(
    (...args) => {
      let value = args[valueFromArg];
      if (value && valueProp) {
        value = value[valueFrom][valueProp];
      }
      if (mapValue) {
        let mapped = mapValue(value);
        if (mapped !== undefined) {
          setValue(mapped);
        }
        return;
      }
      setValue(value);
    },
    [setValue, mapValue, valueFromArg, valueFrom, valueProp],
  );
  return [value, onChange, setValue];
}
/**
 * Hook that returns an input value, `onChange` handler and a value setter.
 * Gets the `value` from `event.target` instead of `event.currentTarget`.
 * @param {any} [defaultValue] The default value. (`""`)
 * @param {UseInputValueOptions<String>} options
 *
 * @example
 *   // Basic usage
 *   const [email, onChangeEmail] = useInputTargetValue();
 *   return <input onChange={onChangeEmail} value={email} />;
 * @example
 *   // Advanced usage
 *   const [email, onChangeEmail, setEmail] = useInputTargetValue();
 *   function onClickClearEmail() { setEmail(""); }
 *   return <input onChange={onChangeEmail} value={email} />;
 */
export function useInputTargetValue(defaultValue = "", options) {
  return useInputValue(defaultValue, {
    valueFrom: "target",
    ...options,
  });
}
/** Returns `true` if the PWA is installed and running in standalone mode. */
export function useInstalledPWA() {
  return useMediaQuery("(display-mode: standalone)");
}
/** Hook that defaults to a blank object, returns a function used to
 * do partial updates of the object state as well as a third function to
 * fully set the state object.
 */
export function useObjectState(defaultValue = {}) {
  const [state, setState] = React.useState(defaultValue);
  /** Function that sets only certain state props. */
  const setStateProps = React.useCallback(
    props => {
      setState(state => ({
        ...state,
        ...props,
      }));
    },
    [setState],
  );
  return [state, setStateProps, setState];
}
/**
 * Hook to run a handler once on mount and never again.
 * @param {() => void} handler Function to run on mount.
 * See https://reactjs.org/docs/hooks-reference.html#useeffect
 * See https://github.com/facebook/create-react-app/issues/6880
 * This function is mainly to provide a better signal to the developer than
 * knowing how `useEffect` works when you pass an empty array. It also helps to
 * get around warnings raised by `react-hooks/exhaustive-deps` and we use it
 * instead of `// eslint-disable-next-line react-hooks/exhaustive-deps`.
 */
export function useOnMount(handler) {
  // Passing an empty array to `useEffect` causes the handler to only run once.
  // See the final API notes for `useEffect` in the docs (link above).
  return React.useEffect(handler, []);
}
/**
 * Calls `React.useReducer` with the given action handler mapping, returning
 * state and a dispatch method.
 * @template R
 * @template I
 * @param {{ [action:string]: React.ReducerAction<R> }} handlers
 * @param {(I & React.ReducerState<R>)} initialState
 * @param {((arg: I & React.ReducerState<R>) => React.ReducerState<R>)} [initializer]
 */
export function useReducerMap(handlers, initialState, initializer) {
  /**
   * @param {(I & React.ReducerState<R>)} state
   * @param {React.ReducerAction<R>} action
   */
  function reduceWithHandler(state, action) {
    const { type } = action;
    const handler = handlers[type];
    if (typeof handler !== "function") {
      throw new Error("Unknown action type: " + type);
    }
    return handler(state, action);
  }
  return React.useReducer(reduceWithHandler, initialState, initializer);
}
/** Creates a timer effect with callback. */
export function useTimeout(handler, values = [], wait = 1000) {
  const callback = React.useCallback(handler);
  React.useEffect(() => {
    // console.log("STARTING TIMEOUT...");
    const timeoutId = setTimeout(callback, wait);
    return () => {
      // console.log("CLEARING TIMEOUT...");
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line
  }, [wait, ...values]);
}

/**
 * @template TValue
 * @typedef UseInputValueOptions
 * @property {number} [delay] Delay in milliseconds. Used when calling
 * `useInputDebounced`. Default: `1000`.
 * @property {(value:TValue)=>any} [mapValue] Maps input value to state value.
 * May return `undefined` to cancel a change.
 * @property {number} [valueFromArg=0] Index of change handler argument to get value from.
 * @property {string} [valueFrom="currentTarget"] Name of the event property
 * to retrieve the `value` property from. Defaults to `"currentTarget"`.
 * @property {string} [valueProp="value"] Name of the property to get the value
 * from. Defaults to `"value"`.
 */
