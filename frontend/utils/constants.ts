/* eslint-disable prefer-destructuring */
export const UNDEFINED = "UNDEFINED";
export const ERROR_LOADING_DATA = "Error loading data";

export const JWT_EXPIRATION_TIME = Number(process.env.NEXT_PUBLIC_EXPIRATION_TIME);

export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const BACKEND_URL = process.env.BACKEND_URL;
export const SECRET = process.env.SECRET;
export const NEXT_PUBLIC_NEXTAUTH_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const CLIENTID = process.env.AZURE_CLIENT_ID;
export const CLIENTSECRET = process.env.AZURE_CLIENT_SECRET;
export const TENANTID = process.env.AZURE_TENANT_ID;
export const NEXT_PUBLIC_ENABLE_AZURE = process.env.NEXT_PUBLIC_ENABLE_AZURE === "true";
export const NEXT_PUBLIC_ENABLE_GIT = process.env.NEXT_PUBLIC_ENABLE_GIT === "true";

export const AUTH_SSO = NEXT_PUBLIC_ENABLE_AZURE || NEXT_PUBLIC_ENABLE_GIT;

export const CURRENT_USER = "currentUser";
export const REFRESH_TOKEN_ERROR = "REFRESH_TOKEN_ERROR";
