/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } & DefaultSession['user'];
    accessToken: string;
    refreshToken?: string;
    expires: number;
    strategy: string;
    isSAdmin: boolean;
    error: string;
  }

  interface User {
    accessToken: string;
    accessTokenExpiresIn: string;
    refreshToken: string;
    refreshTokenExpiresIn: string;
    strategy: string;
    id: string;
    firstName: string;
    lastName: string;
    isSAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    error: string;
    accessTokenExpires: number;
    strategy: string;
    isSAdmin: boolean;
  }
}
