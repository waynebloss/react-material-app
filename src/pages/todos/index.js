import { TodoListPage } from "./TodoListPage";

export const TodoPages = {
  home: {
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
