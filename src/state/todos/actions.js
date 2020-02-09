import { UIActions } from "../ui/actions";
import { timeoutAsync } from "../../lib";

const type = {
  TODO_ITEM_UPDATED: "TODO_ITEM_UPDATED",
  TODO_ITEMS_ADDED: "TODO_ITEMS_ADDED",
  TODO_ITEMS_LOADED: "TODO_ITEMS_LOADED",
};

export const TodoActions = {
  type,

  addItem(item) {
    return async (dispatch, getState) => {
      dispatch(UIActions.setUILoading(true));

      // TODO: Send POST to server to create item.

      // Simulate server creating new item and id.
      await timeoutAsync(1000);
      const maxId = itemsFromServer.reduce(
        (id, item) => (item.id > id ? item.id : id),
        0,
      );
      const newItem = {
        ...item,
        id: maxId + 1,
      };
      itemsFromServer.push({ ...newItem });

      // Put item returned from server into the TodoState.
      dispatch(TodoActions.addedItems([newItem]));
      dispatch(UIActions.setUILoading(false));
    };
  },

  addedItems(items) {
    return { type: type.TODO_ITEMS_ADDED, items };
  },

  getItemById(id) {
    console.log("Getting Todo by id: ", id);
    return async dispatch => {
      dispatch(UIActions.setUILoading(true));

      // const response = await authGet(`/api/todos/${id}`);
      // TODO: Make ajax call as shown above and delete mock response below.

      // Simulate server getting item.
      await timeoutAsync(1000);
      const response = {
        error: undefined,
        data: {
          item: itemsFromServer
            .filter(item => item.id === id)
            // Copy items.
            .map(item => ({ ...item }))[0],
        },
      };
      // TODO: Error handling...
      const {
        data: { item },
      } = response;
      dispatch(UIActions.setUILoading(false));
      return {
        item,
      };
    };
  },

  loadedItems(items) {
    return { type: type.TODO_ITEMS_LOADED, items };
  },

  saveItem(item) {
    if (item.id === 0) {
      return TodoActions.addItem(item);
    }
    return TodoActions.updateItem(item);
  },

  searchItems({ title } = {}) {
    console.log("Searching for Todo title: ", title);
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

  toggleItemDone(id) {
    return (dispatch, getState) => {
      const {
        todo: { items },
      } = getState();
      const item = items.find(it => it.id === id);
      const { done, ...props } = item;
      return dispatch(
        TodoActions.updateItem(
          {
            ...props,
            done: !done,
          },
          250,
        ),
      );
    };
  },

  updateItem({ id, title, done }, simulateDelay = 1000) {
    return async dispatch => {
      dispatch(UIActions.setUILoading(true));

      // TODO: Send PUT to server, receive newly updated item.

      // Simulate server.
      await timeoutAsync(simulateDelay);
      const serverItem = itemsFromServer.find(item => item.id === id);
      serverItem.title = title;
      serverItem.done = done;

      // Load new item from server into the TodoState.
      dispatch(TodoActions.updatedItem({ ...serverItem }));
      dispatch(UIActions.setUILoading(false));
    };
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
