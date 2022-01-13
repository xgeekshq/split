import axios, { AxiosRequestConfig } from "axios";
import { NEXT_PUBLIC_BACKEND_URL } from "./constants";

export const instance = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type Options = {
  token?: string;
} & AxiosRequestConfig;

export const getHeaderToken = () => {
  return instance.defaults.headers.common.Authorization;
};

export const setHeaderToken = (token: string | undefined) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

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
