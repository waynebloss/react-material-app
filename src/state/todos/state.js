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
 * }
 */
export const TodoState = {
  name: "todo",
  persist: false,
  defaults: {
    items: [],
  },
  handlers: {
    [TodoActions.type.TODO_ITEM_UPDATED](state, { item }) {
      // #region NOTE: The need to copy the entire array and find an index
      // is one reason why it's recommended to store lists as an object, e.g.
      // items: {
      //   1: {id:1,title:"",done:false},
      //   2: {id:2,title:"",done:false},
      //   3: {id:3,title:"",done:false},
      // }
      // And then store the sorted ids as an array, e.g.
      // sortedItemIds: [3, 2, 1]
      // #endregion
      const items = [...state.items];
      const index = items.findIndex(it => it.id === item.id);
      items[index] = item;
      return {
        ...state,
        items,
      };
    },
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
  },
};
