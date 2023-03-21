import { UseInfiniteQueryResult, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Nullable } from '../common';
import { Token } from '../token';
import { CreateGuestUser } from './create-login.user';

export interface User {
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
  providerAccountCreatedAt?: string;
  isAnonymous?: boolean;
}

export interface UseUserType {
  loginAzure: () => Promise<void>;
  resetToken: UseMutationResult<ResetTokenResponse, AxiosError, EmailUser>;
  resetPassword: UseMutationResult<ResetPasswordResponse, AxiosError, NewPassword>;
  updateUserIsAdmin: UseMutationResult<User, unknown, UpdateUserIsAdmin, unknown>;
  deleteUser: UseMutationResult<Boolean, unknown, DeleteUser, unknown>;
  fetchUsers: UseQueryResult<User[], unknown>;
  getUserById: UseQueryResult<User, unknown>;
  fetchUsersWithTeams: UseInfiniteQueryResult<InfiniteUsersWithTeams, unknown>;
  registerGuestUser: UseMutationResult<GuestUser, unknown, CreateGuestUser, unknown>;
  loginGuestUser: UseMutationResult<GuestUser, unknown, GuestUser, unknown>;
}

export interface LoginUser {
  email: Nullable<string>;
  password: Nullable<string>;
}

export interface EmailUser {
  email: string;
}

export interface LoginGuestUser {
  username: string;
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
  teamsNames?: string[];
}

export interface InfiniteUsersWithTeams {
  userWithTeams: UserWithTeams[];
  hasNextPage: boolean;
  page: number;
  userAmount: number;
}

export interface UpdateUserIsAdmin {
  _id: string;
  isSAdmin: boolean;
}

export interface DeleteUser {
  id: string;
}

export type UserZod = 'name' | 'email' | 'password' | 'passwordConf';

export type GuestUser = {
  accessToken: Token;
  user: string;
};
