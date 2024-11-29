import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import axios, { AxiosRequestConfig } from 'axios';

import { NEXT_PUBLIC_BACKEND_URL } from '@/constants';
import { GuestUser } from '@/types/user/user';
import { getGuestUserCookies } from '@/utils/getGuestUserCookies';

export const instance = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const nonNeededToken = ['/auth/login', '/auth/refresh', '/auth/registerAzure'];

export const getToken = async (context?: GetServerSidePropsContext) => {
  const session = await getSession(context);

  // accessing cookies depends on where it is called (server side or client side)

  if (!session) {
    let guestUserCookie: GuestUser;
    if (context) {
      const { req, res } = context;
      guestUserCookie = getGuestUserCookies({ req, res }, true);
    } else {
      guestUserCookie = getGuestUserCookies();
    }

    // when user is a guest, the token is accessed through cookie
    if (!session && guestUserCookie) return `Bearer ${guestUserCookie.accessToken.token}`;
  }

  // when user is logged in, the token is accessed through session
  if (session) {
    return `Bearer ${session?.user.accessToken.token}`;
  }

  return 'Bearer ';
};

instance.interceptors.request.use(async (config) => {
  const { url, headers } = config;
  if (url && headers && !nonNeededToken.includes(url)) headers.Authorization = await getToken();
  return config;
});

export const serverSideInstance = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type Options = {
  refreshToken?: string;
  serverSide?: boolean;
  context?: GetServerSidePropsContext;
  isPublicRequest?: boolean;
} & AxiosRequestConfig;

const fetchData = async <T,>(url: string, options?: Options): Promise<T> => {
  const { method = 'GET', context, refreshToken, serverSide, isPublicRequest } = options ?? {};
  const instanceOptions: AxiosRequestConfig = {
    url,
    method,
    ...options,
  };

  if (context || refreshToken) {
    instanceOptions.headers = !isPublicRequest
      ? {
          ...options?.headers,
          Authorization: refreshToken ? `Bearer ${refreshToken}` : await getToken(context),
        }
      : {
          ...options?.headers,
        };
  }

  const { data } = !serverSide
    ? await instance(instanceOptions)
    : await serverSideInstance(instanceOptions);

  return data;
};

export default fetchData;
