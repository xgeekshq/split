import { Token } from '../token';

export interface CreateOrLogin {
  strategy?: string;
  email: string;
  _id: string;
  accessToken: Token;
  refreshToken: Token;
  firstName: string;
  lastName: string;
  isSAdmin: boolean;
  providerAccountCreatedAt?: string;
  avatar?: string;
}

export interface CreateGuestUser {
  firstName: string;
  lastName?: string;
  board: string;
}
