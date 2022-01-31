/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      id: string;
    };
    accessToken: string;
    refreshToken?: string;
    expires: number;
    strategy: string;
  }

  interface User {
    accessToken: string;
    accessTokenExpiresIn: string;
    refreshToken: string;
    refreshTokenExpiresIn: string;
    strategy: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    name: string;
    email: string;
    id: string;
    error: string;
    accessTokenExpires: number;
    strategy: string;
  }
}
