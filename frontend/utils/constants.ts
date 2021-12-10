export const NEXT_PUBLIC_BACKEND_URL = Symbol("NEXT_PUBLIC_BACKEND_URL");
export const BACKEND_URL = Symbol("BACKEND_URL");
export const SECRET = Symbol("SECRET");

export const UNDEFINED = "UNDEFINED";
export const ERROR_LOADING_DATA = "Error loading data";

export const CURRENT_USER = "currentUser";
export const REFRESH_TOKEN_ERROR = "REFRESH_TOKEN_ERROR";

export const DASHBOARD_PATH = "/dashboard";
export const AUTH_PATH = "/auth";
export const ERROR_500_PAGE = "/500";

export const describe = (key: symbol): string | undefined => {
  switch (key) {
    case NEXT_PUBLIC_BACKEND_URL:
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    case BACKEND_URL:
      return process.env.BACKEND_URL;
    case SECRET:
      return process.env.SECRET;
    default:
      return undefined;
  }
};
