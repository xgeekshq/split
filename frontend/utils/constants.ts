export const NEXT_PUBLIC_BACKEND_URL = Symbol("NEXT_PUBLIC_BACKEND_URL");
export const BACKEND_URL = Symbol("BACKEND_URL");
export const JWT_EXPIRATION_TIME = Symbol("JWT_EXPIRATION_TIME");
export const JWT_SIGNING_KEY_ID = Symbol("JWT_SIGNING_KEY_ID");
export const JWT_SIGNING_KEY = Symbol("JWT_SIGNING_KEY");

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
    case JWT_EXPIRATION_TIME:
      return process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    case JWT_SIGNING_KEY_ID:
      return process.env.JWT_SIGNING_KEY_ID;
    case JWT_SIGNING_KEY:
      return process.env.JWT_SIGNING_KEY;
    default:
      return undefined;
  }
};
