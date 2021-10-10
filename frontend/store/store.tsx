import React, { Dispatch, Reducer, useReducer, useContext } from "react";

type Nullable<T> = T | null | undefined;

type State<TitleT, ValueT> = {
  title: Nullable<TitleT>;
  val: Nullable<ValueT>;
};

type Event<ValueT> = { type: "setTitle"; val: ValueT };

function useStateMachine<TitleT, ValueT>(
  initialData: Nullable<TitleT>
): [State<TitleT, ValueT>, Dispatch<Event<ValueT>>] {
  const initialState: State<TitleT, ValueT> = {
    title: initialData,
    val: null,
  };

  function fetchReducer(state: State<TitleT, ValueT>, event: Event<ValueT>): State<TitleT, ValueT> {
    switch (event.type) {
      case "setTitle": {
        return { ...state, title: event.val as unknown as TitleT };
      }
      default: {
        throw new Error(`Unhandled event type: ${event.type}`);
      }
    }
  }

  return useReducer<Reducer<State<TitleT, ValueT>, Event<ValueT>>>(fetchReducer, initialState);
}

type ContextType = {
  state: State<string, string>;
  dispatch: Dispatch<Event<string>>;
};

const Context = React.createContext<Nullable<ContextType>>(undefined);

const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useStateMachine<string, string>(null);

  const value = {
    state,
    dispatch,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useStoreContext = (): ContextType => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
};

export { StoreProvider, useStoreContext };
