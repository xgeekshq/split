import { useCallback } from "react";
import { Nullable } from "../types/types";
import useFetchStateMachine from "../reducers/useFetchStateMachine";

interface DataT {
  data: JSON;
}

interface ErrorT {
  message: string;
}

interface HttpType {
  data: Nullable<DataT>;
  error: Nullable<ErrorT>;
  sendRequest: (url: string, method: Nullable<string>, body: Nullable<string>) => void;
  clear: () => void;
}

const useHttp = (): HttpType => {
  const [httpState, dispatchHttp] = useFetchStateMachine<DataT, ErrorT>(null);

  const clear = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, [dispatchHttp]);

  const sendRequest = useCallback(
    (url, method, body) => {
      dispatchHttp({ type: "FETCH" });
      fetch(url, {
        method,
        body,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((responseData) => {
          dispatchHttp({ type: "RESOLVE", data: responseData });
        })
        .catch((err) => {
          dispatchHttp({ type: "REJECT", error: { message: err } });
        });
    },
    [dispatchHttp]
  );

  return {
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    clear,
  };
};

export default useHttp;
