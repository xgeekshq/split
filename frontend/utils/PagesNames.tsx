interface NamesType {
  [key: string]: string;
}

const names: NamesType = { Dashboard: "/" };

export const GetPagePathByName = (pageName: string): string => {
  return names[pageName];
};

export const CheckIsBoardPage = (url: string): boolean => {
  return url.startsWith("/boards");
};
