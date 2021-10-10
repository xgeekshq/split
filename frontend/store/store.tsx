import React, { Dispatch, useContext } from "react";
import useStateMachine, { Nullable, State, Event } from "./useStoreStateMachine";

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

const useStoreContext = (): Nullable<ContextType> => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
};

export { StoreProvider, useStoreContext };
