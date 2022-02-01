import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { BACKEND_URL, NEXT_PUBLIC_BACKEND_URL } from "./constants";

export const instance = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const nonNeededToken = ["/auth/login", "/auth/refresh", "/auth/registerAzure"];

instance.interceptors.request.use(async (config) => {
  const { url, headers } = config;
  if (url && headers && !nonNeededToken.includes(url)) {
    const session = await getSession();

    headers.Authorization = `Bearer ${session?.accessToken}`;
  }

  return config;
});

export const serverSideInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type Options = {
  token?: string;
  serverSide?: boolean;
} & AxiosRequestConfig;

const fetchData = async <T,>(url: string, options?: Options): Promise<T> => {
  const { method = "GET", token, serverSide } = options ?? {};
  const instanceOptions: AxiosRequestConfig = {
    url,
    method,
    ...options,
  };

  if (token) {
    instanceOptions.headers = {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const { data } = !serverSide
    ? await instance(instanceOptions)
    : await serverSideInstance(instanceOptions);
  return data;
};

export default fetchData;
