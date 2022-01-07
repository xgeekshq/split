import { UNDEFINED } from "./constants";

export const DASHBOARD_ROUTE = "/dashboard";
export const AUTH_ROUTE = "/auth";
export const LANDING_ROUTE = "/";
export const ERROR_500_PAGE = "/500";

export const ROUTES = {
  LandingPage: LANDING_ROUTE,
  Dashboard: DASHBOARD_ROUTE,
  Auth: AUTH_ROUTE,
  BoardPage: (boardId: string): string => `/boards/${boardId}`,
};

export const GetPageTitleByUrl = (url: string): string => {
  return Object.keys(ROUTES).find((key) => ROUTES[key as keyof typeof ROUTES] === url) ?? UNDEFINED;
};

export const CheckIsBoardPage = (url: string): boolean => {
  return url.startsWith("/boards");
};
export const ShouldRenderNav = (url: string): boolean => {
  return url !== "/" && !url.startsWith("/auth") && !url.startsWith("/500");
};
