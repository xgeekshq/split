import { UseMutationResult } from "react-query";
import { AxiosError } from "axios";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  passwordConf?: string;
}

export interface UseUserType {
  [key: string]: UseMutationResult<User, AxiosError, User, unknown>;
}

export type UserYup = "name" | "email" | "password" | "passwordConf";
