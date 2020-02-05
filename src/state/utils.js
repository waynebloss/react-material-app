import { bindActionCreators } from "redux";
import { connect } from "react-redux";

/**
 * Returns a `mapDispatchToProps` function built from the given `actions` array
 * for a call to react-redux `connect`.
 * @param {import("redux").ActionCreatorsMapObject<any>[]} actions
 */
function mapActionsArrayDispatch(actions) {
  return dispatch => ({
    actions: actions.reduce(
      (map, action) => Object.assign(map, bindActionCreators(action, dispatch)),
      {},
    ),
  });
}
/**
 * Convenience method for calling react-redux `connect`.
 * @param {React.ComponentType} view The react component to connect to redux.
 * @param {((state:any,props:any)=>any) | import("redux").ActionCreatorsMapObject<any>[]}
 * mapStateOrActions The `mapStateToProps` function OR an array of action
 * creator map objects.
 * @param {import("redux").ActionCreatorsMapObject<any>[] | import("react-redux").MapDispatchToPropsFunction<any,any>}
 * [actions] An array of action creator map objects OR a `mapDispatchToProps`
 * function.
 * @param {import("react-redux").MergeProps<any,any,any,any>} [mergeProps]
 * The `mergeProps` function used as the third argument to `connect`.
 */
export function connectView(view, mapStateOrActions, actions, mergeProps) {
  let mapDispatch;
  if (Array.isArray(mapStateOrActions)) {
    // Not mapping state, just actions - shift args after `view` left by one.
    mergeProps = actions;
    actions = mapStateOrActions;
    mapStateOrActions = undefined;
    // Since we now know that `actions` is an array, map it.
    mapDispatch = mapActionsArrayDispatch(actions);
  } else if (Array.isArray(actions)) {
    mapDispatch = mapActionsArrayDispatch(actions);
  } else {
    const actionsType = typeof actions;
    if (actionsType === "function" || actionsType === "undefined") {
      mapDispatch = actions;
    } else {
      throw new Error(
        "The `actions` argument must be an array of action creator " +
          "map objects, a mapDispatchToProps function or undefined.",
      );
    }
  }
  return connect(
    mapStateOrActions,
    mapDispatch,
    mergeProps,
  )(view);
}
