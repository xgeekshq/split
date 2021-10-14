import React, { Dispatch, useContext } from "react";
import { Nullable } from "../types/commonTypes";
import useStateMachine, { State, Event } from "../reducers/useStoreStateMachine";

type ContextType = {
  state: State<string>;
  dispatch: Dispatch<Event<string>>;
};

const Context = React.createContext<Nullable<ContextType>>(undefined);

const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useStateMachine<string, string>(undefined);

  const value = {
    state,
    dispatch,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useStoreContext = (): ContextType => {
  const context = useContext(Context);
  if (context === undefined || context === null) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
};

export { StoreProvider, useStoreContext };
