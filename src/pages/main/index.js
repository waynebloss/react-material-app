import { HomePage } from "./HomePage";
import { NotFoundPage } from "./NotFoundPage";

export const MainPages = {
  home: {
    anon: false,
    path: "/",
    title: "Home",
    type: "PAGE_HOME",
    view: HomePage,
  },
  notFound: {
    anon: true,
    layout: null,
    path: "*",
    title: "Page Not Found",
    type: "PAGE_NOT_FOUND",
    view: NotFoundPage,
  },
};
export default MainPages;

export const MainArea = {
  pages: MainPages,
};
