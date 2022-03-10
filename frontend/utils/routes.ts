import { UNDEFINED } from "./constants";

export const DASHBOARD_ROUTE = "/dashboard";
export const START_PAGE_ROUTE = "/";
export const ERROR_500_PAGE = "/500";

export const ROUTES = {
  START_PAGE_ROUTE,
  Dashboard: DASHBOARD_ROUTE,
  BoardPage: (boardId: string): string => `/boards/${boardId}`,
};

export const GetPageTitleByUrl = (url: string): string => {
  return Object.keys(ROUTES).find((key) => ROUTES[key as keyof typeof ROUTES] === url) ?? UNDEFINED;
};

export const CheckIsBoardPage = (url: string): boolean => {
  return url.startsWith("/boards");
};
export const ShouldRenderNav = (url: string): boolean => {
  return url !== "/" && !url.startsWith("/500");
};
