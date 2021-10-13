import { useReducer, Dispatch, Reducer } from "react";
import { Nullable } from "../types/types";

type FetchMachineState<DataT, ErrorT> = {
  status: "idle" | "loading" | "success" | "failure";
  data: Nullable<DataT>;
  error: Nullable<ErrorT>;
};

type Event<DataT, ErrorT> =
  | { type: "CLEAR" }
  | { type: "FETCH" }
  | { type: "RESOLVE"; data: DataT }
  | { type: "REJECT"; error: ErrorT };

function useFetchStateMachine<DataT, ErrorT = string>(
  initialData: Nullable<DataT>
): [FetchMachineState<DataT, ErrorT>, Dispatch<Event<DataT, ErrorT>>] {
  const initialState: FetchMachineState<DataT, ErrorT> = {
    status: "idle",
    data: initialData,
    error: null,
  };

  function fetchReducer(
    state: FetchMachineState<DataT, ErrorT>,
    event: Event<DataT, ErrorT>
  ): FetchMachineState<DataT, ErrorT> {
    switch (event.type) {
      case "CLEAR":
        return {
          status: "idle",
          data: null,
          error: null,
        };
      case "FETCH":
        return {
          ...state,
          status: "loading",
        };
      case "RESOLVE":
        return {
          ...state,
          status: "success",
          data: event.data,
        };
      case "REJECT":
        return {
          ...state,
          status: "failure",
          error: event.error,
        };
      default:
        return state;
    }
  }

  return useReducer<Reducer<FetchMachineState<DataT, ErrorT>, Event<DataT, ErrorT>>>(
    fetchReducer,
    initialState
  );
}

export default useFetchStateMachine;
