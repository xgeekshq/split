import { Dispatch, SetStateAction } from "react";
import { UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { AccessToken, RefreshToken } from "./token";

export interface User {
  _id?: string;
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
  email: string;
  password: string;
}

export type UserYup = "name" | "email" | "password" | "passwordConf";

export type Credentials = "email" | "password" | "name" | "accessToken" | "refreshToken" | "error";
