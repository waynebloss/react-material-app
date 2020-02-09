import { TodoActions } from "./actions";

/**
 * Todo state (**NOT** persisted).
 * @example
 * {
 *    items: [
 *      { id: 1, title: "", done: false, },
 *      { id: 2, title: "", done: false, },
 *      { id: 3, title: "", done: false, },
 *    ],
 *    nextId: 4, // Used to generate ids for demo. Normally done on server.
 * }
 */
export const TodoState = {
  name: "todo",
  persist: false,
  defaults: {
    items: [],
    nextId: -1,
  },
  handlers: {
    [TodoActions.type.TODO_ITEMS_ADDED](state, { items }) {
      return {
        ...state,
        // Copy old and new items into a new array.
        items: [...state.items, ...items],
      };
    },
    [TodoActions.type.TODO_ITEMS_LOADED](state, { items }) {
      return {
        ...state,
        items,
      };
    },
    [TodoActions.type.TODO_NEXTID_SET](state, { nextId }) {
      return {
        ...state,
        nextId,
      };
    },
  },
};
