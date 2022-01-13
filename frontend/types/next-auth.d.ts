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
  }

  interface User {
    accessToken: {
      token: string;
      expiresIn: string;
    };
    refreshToken: {
      token: string;
      expiresIn: string;
    };
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
  }
}
