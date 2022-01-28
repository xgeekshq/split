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
