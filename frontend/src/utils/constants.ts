import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export const UNDEFINED = 'UNDEFINED';
export const ERROR_LOADING_DATA = 'Error loading data';

export const JWT_EXPIRATION_TIME = Number(publicRuntimeConfig.NEXT_PUBLIC_EXPIRATION_TIME);

export const { NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_NEXTAUTH_URL, SECRET } = publicRuntimeConfig;

export const CLIENT_ID = serverRuntimeConfig.AZURE_CLIENT_ID;
export const CLIENT_SECRET = serverRuntimeConfig.AZURE_CLIENT_SECRET;
export const TENANT_ID = serverRuntimeConfig.AZURE_TENANT_ID;

export const NEXT_PUBLIC_ENABLE_AZURE = publicRuntimeConfig.NEXT_PUBLIC_ENABLE_AZURE === 'true';
export const NEXT_PUBLIC_ENABLE_GIT = publicRuntimeConfig.NEXT_PUBLIC_ENABLE_GIT === 'true';
export const NEXT_PUBLIC_ENABLE_GOOGLE = publicRuntimeConfig.NEXT_PUBLIC_ENABLE_GOOGLE === 'true';

export const AUTH_SSO =
  NEXT_PUBLIC_ENABLE_AZURE || NEXT_PUBLIC_ENABLE_GIT || NEXT_PUBLIC_ENABLE_GOOGLE;

export const REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR';

// -------------------------------
