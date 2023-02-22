import { GetServerSidePropsContext } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import { NEXT_PUBLIC_BACKEND_URL } from './constants';

type Options = {
  refreshToken?: string;
  serverSide?: boolean;
  context?: GetServerSidePropsContext;
} & AxiosRequestConfig;
const serverSideInstance = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
const fetchPublicData = async <T>(url: string, options?: Options): Promise<T> => {
  // serverSide
  const { method = 'GET', context } = options ?? {};
  const instanceOptions: AxiosRequestConfig = {
    url,
    method,
    ...options,
  };

  if (context) {
    instanceOptions.headers = {
      ...options?.headers,
    };
  }
  const { data } = await serverSideInstance(instanceOptions);
  return data;
};
export default fetchPublicData;
