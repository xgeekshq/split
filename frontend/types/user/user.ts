import { Dispatch, SetStateAction } from "react";
import { UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { Nullable } from "../common";
import { AccessToken, RefreshToken } from "../token";

export interface User {
  id?: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  passwordConf?: string;
  accessToken?: AccessToken;
  refreshToken?: RefreshToken;
  isSAdmin: boolean;
}

export interface UseUserType {
  createUser: UseMutationResult<User, AxiosError, User, unknown>;
  setPw: Dispatch<SetStateAction<string>>;
  loginAzure: () => Promise<void>;
}

export interface LoginUser {
  email: Nullable<string>;
  password: Nullable<string>;
}

export interface EmailUser {
  email: string;
}

export type UserZod = "name" | "email" | "password" | "passwordConf";
