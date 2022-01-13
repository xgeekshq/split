import { Dispatch, SetStateAction } from "react";
import { UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { AccessToken, RefreshToken } from "./token";
import { Nullable } from "./common";

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  passwordConf?: string;
  accessToken?: AccessToken;
  refreshToken?: RefreshToken;
}

export interface UseUserType {
  createUser: UseMutationResult<User, AxiosError, User, unknown>;
  setPw: Dispatch<SetStateAction<string>>;
}

export interface LoginUser {
  email: Nullable<string>;
  password: Nullable<string>;
}

export type UserZod = "name" | "email" | "password" | "passwordConf";
