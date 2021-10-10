interface NamesType {
  [key: string]: string;
}

const names: NamesType = { "/": "Dashboard" };

const GetPageName = (url: string): string => {
  return names[url];
};

export const CheckIsPageName = (url: string): boolean => {
  return url.startsWith("/boards");
};

export default GetPageName;
