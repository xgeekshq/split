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
export const ShouldRenderNav = (url: string): boolean => {
  return url !== "/" && !url.startsWith("/auth") && !url.startsWith("/500");
};
