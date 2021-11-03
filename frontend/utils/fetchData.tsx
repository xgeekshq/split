import axios, { Method } from "axios";
import { API_URL } from "./constants";
import { Nullable } from "../types/common";

const fetchData = async <T,>(url: string, method: Method, body: Nullable<string>): Promise<T> => {
  const { data } = await axios({
    url: `${API_URL}${url}`,
    method,
    data: body,
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export default fetchData;
