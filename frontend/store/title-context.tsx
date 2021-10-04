import React, { useState } from "react";

type TitleContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const defaultTitleContextValues: TitleContextType = {
  title: "",
  setTitle: () => {},
};

const TitleContext = React.createContext<TitleContextType>(defaultTitleContextValues);

export const TitleContextProvider: React.FC = ({ children }) => {
  const [title, setTitleState] = useState(defaultTitleContextValues.title);

  const setTitle = (newTitle: string) => {
    setTitleState(newTitle);
  };

  const contextValue = {
    title,
    setTitle,
  };

  return <TitleContext.Provider value={contextValue}>{children}</TitleContext.Provider>;
};

export default TitleContext;
