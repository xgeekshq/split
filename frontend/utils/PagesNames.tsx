import { DASHBOARD_PATH, AUTH_PATH } from "./constants";

interface NamesType {
  [key: string]: string;
}

export const pagesNames: NamesType = {
  LandingPage: "/",
  Dashboard: DASHBOARD_PATH,
  Auth: AUTH_PATH,
};

export const GetPagePathByName = (pageName: string): string => {
  return pagesNames[pageName];
};

export const CheckIsBoardPage = (url: string): boolean => {
  return url.startsWith("/boards");
};
export const ShouldRenderNav = (url: string): boolean => {
  return url !== "/" && !url.startsWith("/auth") && !url.startsWith("/500");
};
