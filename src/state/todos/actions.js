import { UIActions } from "../ui/actions";
import { timeoutAsync } from "../../lib";

const type = {
  TODO_ITEMS_ADDED: "TODO_ITEMS_ADDED",
  TODO_ITEMS_LOADED: "TODO_ITEMS_LOADED",
  TODO_NEXTID_SET: "TODO_NEXTID_SET",
};

export const TodoActions = {
  type,

  addItem(item) {
    return async (dispatch, getState) => {
      const {
        todos: { nextId },
      } = getState();

      dispatch(UIActions.setUILoading(true));

      // TODO: Send POST to server to create item.

      // Simulate server creating new item and id.
      await timeoutAsync(1000);
      const newItem = {
        ...item,
        id: nextId,
      };
      dispatch(TodoActions.setNextId(nextId + 1));
      itemsFromServer.push({ ...newItem });

      // Put item returned from server into the TodoState.
      dispatch(TodoActions.addedItems([newItem]));
      dispatch(UIActions.setUILoading(false));
    };
  },

  addedItems(items) {
    return { type: type.TODO_ITEMS_ADDED, items };
  },

  loadedItems(items) {
    return { type: type.TODO_ITEMS_LOADED, items };
  },

  searchItems({ title } = {}) {
    return async dispatch => {
      dispatch(UIActions.setUILoading(true));

      // const response = await authGet([
      //   "/api/todos/search",
      //   {
      //     title,
      //   },
      // ]);
      // TODO: Make ajax call as shown above and delete mock response below.

      // Simulate server finding items.
      await timeoutAsync(1000);
      const response = {
        error: undefined,
        data: {
          items: itemsFromServer
            .filter(item => !title || item.title.includes(title))
            // Copy items.
            .map(item => ({ ...item })),
        },
      };
      // TODO: Error handling...
      const {
        data: { items },
      } = response;
      dispatch(TodoActions.loadedItems(items));
      dispatch(UIActions.setUILoading(false));
    };
  },

  setItemTitle(id, title) {
    return async dispatch => {
      dispatch(UIActions.setUILoading(true));

      // TODO: Send PUT to server, receive newly updated item.

      // Simulate server.
      await timeoutAsync(1000);
      const serverItem = itemsFromServer.find(item => item.id === id);
      serverItem.title = title;

      // Load new item from server into the TodoState.
      dispatch(TodoActions.updatedItem({ ...serverItem }));
      dispatch(UIActions.setUILoading(false));
    };
  },

  setNextId(nextId) {
    return { type: type.TODO_NEXTID_SET, nextId };
  },

  updatedItem(item) {
    return { type: type.TODO_ITEM_UPDATED, item };
  },
};

/** Mock items. */
const itemsFromServer = [
  { id: 1, title: "Boil water.", done: true },
  { id: 2, title: "Grind coffee beans.", done: false },
  { id: 3, title: "Put coffee grinds in filter.", done: false },
  { id: 4, title: "Pour hot water over coffee grinds.", done: false },
];
