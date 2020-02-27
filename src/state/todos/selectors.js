export const TodoSelectors = {
  items(state) {
    return state.todo?.items ?? [];
  },
};
