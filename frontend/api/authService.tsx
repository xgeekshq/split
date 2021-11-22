import { Token } from "../types/token";
import { User, LoginUser } from "../types/user";
import fetchData from "../utils/fetchData";

export const postUser = (newUser: User): Promise<User> => {
  return fetchData(`/auth/register`, "POST", JSON.stringify(newUser), undefined);
};

export const login = (credentials: LoginUser): Promise<User> => {
  return fetchData("/auth/login", "POST", JSON.stringify(credentials), undefined);
};

export const refreshToken = (token: Nullable<string>): Promise<Token> => {
  return fetchData("/auth/refresh", "GET", undefined, token);
};
