import { Dispatch, Reducer, useReducer } from "react";
import { Nullable } from "../types/common";

export type State<TitleT> = {
  title: Nullable<TitleT>;
};

export type Event<ValueT> = { type: "setTitle"; val: ValueT };

function useStateMachine<TitleT, ValueT>(
  initialData: Nullable<TitleT>
): [State<TitleT>, Dispatch<Event<ValueT>>] {
  const initialState: State<TitleT> = {
    title: initialData,
  };

  function storeReducer(state: State<TitleT>, event: Event<ValueT>): State<TitleT> {
    switch (event.type) {
      case "setTitle": {
        return { ...state, title: event.val as unknown as TitleT };
      }
      default: {
        throw new Error(`Unhandled event type: ${event.type}`);
      }
    }
  }

  return useReducer<Reducer<State<TitleT>, Event<ValueT>>>(storeReducer, initialState);
}

export default useStateMachine;
