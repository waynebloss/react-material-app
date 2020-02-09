export function todoItems(state) {
  const {
    todo: { items },
  } = state;
  return {
    todoItems: items,
  };
}
