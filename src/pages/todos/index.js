import { TodoListPage } from "./TodoListPage";
import { TodoEditPage } from "./TodoEditPage";

export const TodoPages = {
  edit: {
    anon: false,
    path: "/todos/:id",
    title: "Todo",
    type: "PAGE_TODO_EDIT",
    view: TodoEditPage,
  },
  list: {
    anon: false,
    path: "/todos",
    title: "Todos",
    type: "PAGE_TODO_LIST",
    view: TodoListPage,
  },
};
export default TodoPages;

export const TodoArea = {
  pages: TodoPages,
};
