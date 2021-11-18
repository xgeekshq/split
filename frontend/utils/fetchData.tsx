/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import axios, { Method } from "axios";
import { NEXT_PUBLIC_BACKEND_URL, describe } from "./constants";
import { Nullable } from "../types/common";

const fetchData = async <T,>(
  url: string,
  method: Method,
  body: Nullable<string>,
  token: Nullable<string>
): Promise<T> => {
  const { data } = await axios({
    baseURL: describe(NEXT_PUBLIC_BACKEND_URL),
    url,
    method,
    data: body,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export default fetchData;
