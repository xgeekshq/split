/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultSession } from 'next-auth';
import { Token } from './token';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      isSAdmin: boolean;
      accessToken: Token;
      refreshToken?: Token;
    } & DefaultSession['user'];
    strategy: string;
    error: string;
  }

  interface User {
    accessToken: Token;
    refreshToken: Token;
    strategy: string;
    id: string;
    firstName: string;
    lastName: string;
    isSAdmin: boolean;
    providerAccountCreatedAt?: Date;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      accessToken: Token;
      refreshToken: Token;
      firstName: string;
      lastName: string;
      email: string;
      id: string;
      isSAdmin: boolean;
    };
    error: string;
    strategy: string;
  }
}
