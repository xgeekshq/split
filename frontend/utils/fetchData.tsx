import { Nullable } from "../types/commonTypes";

const fetchData = async <T,>(url: string, method: string, body: Nullable<string>): Promise<T> => {
  const response = await fetch(url, {
    method,
    body,
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
};

export default fetchData;
