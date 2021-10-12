import { Dispatch, Reducer, useReducer } from "react";
import { Nullable } from "../utils/types";

export type State<TitleT, ValueT> = {
  title: Nullable<TitleT>;
  val: Nullable<ValueT>;
};

export type Event<ValueT> = { type: "setTitle"; val: ValueT };

function useStateMachine<TitleT, ValueT>(
  initialData: Nullable<TitleT>
): [State<TitleT, ValueT>, Dispatch<Event<ValueT>>] {
  const initialState: State<TitleT, ValueT> = {
    title: initialData,
    val: null,
  };

  function storeReducer(state: State<TitleT, ValueT>, event: Event<ValueT>): State<TitleT, ValueT> {
    switch (event.type) {
      case "setTitle": {
        return { ...state, title: event.val as unknown as TitleT };
      }
      default: {
        throw new Error(`Unhandled event type: ${event.type}`);
      }
    }
  }

  return useReducer<Reducer<State<TitleT, ValueT>, Event<ValueT>>>(storeReducer, initialState);
}

export default useStateMachine;
