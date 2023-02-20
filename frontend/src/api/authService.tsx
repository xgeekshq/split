import { GetServerSidePropsContext } from 'next';

import { HeaderInfo } from '@/types/dashboard/header.info';
import { Token } from '@/types/token';
import { CreateGuestUser, CreateOrLogin } from '@/types/user/create-login.user';
import {
  EmailUser,
  GuestUser,
  LoginUser,
  NewPassword,
  RegisterUser,
  ResetPasswordResponse,
  ResetTokenResponse,
  User,
} from '@/types/user/user';
import fetchData from '@/utils/fetchData';
import fetchPublicData from '@/utils/fetchPublicData';

export const getDashboardHeaderInfo = (context?: GetServerSidePropsContext): Promise<HeaderInfo> =>
  fetchData(`auth/statistics`, { context, serverSide: !!context });

export const registerNewUser = (newUser: RegisterUser): Promise<User> =>
  fetchData('/auth/register', { method: 'POST', data: newUser, serverSide: false });

export const login = (credentials: LoginUser): Promise<User> =>
  fetchData('/auth/login', { method: 'POST', data: credentials, serverSide: true });

export const checkUserExistsAD = (email: string): Promise<'az' | 'local' | false> =>
  fetchData(`/auth/azure/users/${email}`);

export const checkUserExists = (email: string): Promise<'az' | 'local' | boolean> =>
  fetchData(`/auth/users/${email}`);

export const createOrLoginUserAzure = (azureAccessToken: string): Promise<CreateOrLogin> =>
  fetchData(`/auth/azure`, {
    method: 'POST',
    data: { token: azureAccessToken },
    serverSide: true,
  });

export const resetTokenEmail = (email: EmailUser): Promise<ResetTokenResponse> =>
  fetchData(`/auth/password/reset`, { method: 'PATCH', data: email });

export const refreshAccessToken = (token: string): Promise<Token> =>
  fetchData('/auth/refresh', { refreshToken: token, serverSide: true });

export const resetUserPassword = (params: NewPassword): Promise<ResetPasswordResponse> =>
  fetchData('/auth/password', {
    method: 'PATCH',
    data: params,
  });

export const registerGuest = (newGuestUser: CreateGuestUser): Promise<GuestUser> =>
  fetchPublicData('/auth/loginGuest', { method: 'POST', data: newGuestUser });

export const loginGuest = (guestUser: GuestUser): Promise<GuestUser> =>
  fetchPublicData('/auth/loginGuest', { method: 'POST', data: guestUser });
