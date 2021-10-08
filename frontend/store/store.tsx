import React, { useReducer, useContext } from "react";

type Action = { type: "setTitle"; val: string };
type Dispatch = (action: Action) => void;
type State = StateType;

type StateType = {
  title: string;
};

type ContextType = { state: State; dispatch: Dispatch };

const storeReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setTitle": {
      return { ...state, title: action.val };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const Context = React.createContext<ContextType | undefined>(undefined);

const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, { title: "" });

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
