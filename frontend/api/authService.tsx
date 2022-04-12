import { Token } from "../types/token";
import { CreateOrLogin } from "../types/user/create-login.user";
import { User, LoginUser } from "../types/user/user";
import fetchData from "../utils/fetchData";

export const postUser = (newUser: User): Promise<User> => {
  return fetchData(`/auth/register`, { method: "POST", data: newUser });
};

export const login = (credentials: LoginUser): Promise<User> => {
  return fetchData("/auth/login", { method: "POST", data: credentials, serverSide: true });
};

export const createOrLoginUserAzure = (azureAccessToken: string): Promise<CreateOrLogin> => {
  return fetchData(`/auth/signAzure`, {
    method: "POST",
    data: { token: azureAccessToken },
    serverSide: true,
  });
};

export const refreshAccessToken = (token: string): Promise<Token> => {
  return fetchData("/auth/refresh", { refreshToken: token, serverSide: true });
};
