import { Token } from "../types/token";
import { User, LoginUser } from "../types/user";
import fetchData from "../utils/fetchData";

export const postUser = (newUser: User): Promise<User> => {
  return fetchData(`/auth/register`, { method: "POST", data: newUser });
};

export const login = (credentials: LoginUser): Promise<User> => {
  return fetchData("/auth/login", { method: "POST", data: credentials });
};

export const refreshToken = (token: string): Promise<Token> => {
  return fetchData("/auth/refresh", { token });
};
