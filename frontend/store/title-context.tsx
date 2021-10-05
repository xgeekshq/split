import React, { useState } from "react";
import { useRouter } from "next/router";

type TitleContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const defaultTitleContextValues: TitleContextType = {
  title: "",
  setTitle: () => {},
};

const TitleContext = React.createContext<TitleContextType>(defaultTitleContextValues);

const handleTitle = (path: string) => {
  let title = "";
  if (path === "/dashboard") {
    title = "Dashboard";
  }
  return title;
};

export const TitleContextProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [title, setTitleState] = useState(handleTitle(router.pathname));

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
