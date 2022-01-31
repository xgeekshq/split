import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { NEXT_PUBLIC_BACKEND_URL } from "./constants";

export const instance = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const nonNeededToken = ["/auth/login", "/auth/refresh"];

instance.interceptors.request.use(async (config) => {
  const { url, headers } = config;
  if (url && headers && !nonNeededToken.includes(url)) {
    const session = await getSession();

    headers.Authorization = `Bearer ${session?.accessToken}`;
  }

  return config;
});

export const fetchInstance = axios.create();

type Options = {
  token?: string;
} & AxiosRequestConfig;

const fetchData = async <T,>(url: string, options?: Options): Promise<T> => {
  const { method = "GET", token } = options ?? {};
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

  const { data } = await instance(instanceOptions);
  return data;
};

export default fetchData;
