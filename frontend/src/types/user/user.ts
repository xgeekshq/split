import { UseMutationResult } from 'react-query/types/react/types';
import { AxiosError } from 'axios';

import { Nullable } from '../common';
import { Token } from '../token';

export interface User {
  id?: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  passwordConf?: string;
  accessToken?: Token;
  refreshToken?: Token;
  isSAdmin: boolean;
  joinedAt: string;
}

export interface UseUserType {
  loginAzure: () => Promise<void>;
  resetToken: UseMutationResult<ResetTokenResponse, AxiosError, EmailUser>;
  resetPassword: UseMutationResult<ResetPasswordResponse, AxiosError, NewPassword>;
}

export interface LoginUser {
  email: Nullable<string>;
  password: Nullable<string>;
}

export interface EmailUser {
  email: string;
}

export interface RegisterUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface ResetTokenResponse {
  message: string;
}

export interface NewPassword {
  password: string;
  passwordConf: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface UserWithTeams {
  user: User;
  teams: string[];
}

export type UserZod = 'name' | 'email' | 'password' | 'passwordConf';
