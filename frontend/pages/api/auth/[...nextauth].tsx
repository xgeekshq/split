import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import {
  AUTH_PATH,
  DASHBOARD_PATH,
  ERROR_500_PAGE,
  JWT_SIGNING_KEY,
  JWT_SIGNING_KEY_ID,
  REFRESH_TOKEN_ERROR,
  describe,
} from "../../../utils/constants";
import { Credentials, LoginUser, User } from "../../../types/user";
import { login, refreshToken } from "../../../api/authService";
import { Token } from "../../../types/token";

async function refreshAccessToken(prevToken: JWT) {
  try {
    const data: Token = await refreshToken(prevToken.refreshToken ?? null);
    return {
      ...prevToken,
      accessToken: data.token,
      accessTokenExpires: Date.now() + +data.expiresIn * 1000,
      error: "",
    };
  } catch (error) {
    return { ...prevToken, error: REFRESH_TOKEN_ERROR };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, Credentials>) {
        const loginUser: LoginUser = {
          email: credentials.email,
          password: credentials.password,
        };
        const data: User = await login(loginUser);
        if (data) {
          const token = {
            name: data.name,
            email: data.email,
            accessToken: { ...data.accessToken },
            refreshToken: { ...data.refreshToken },
          };
          return token;
        }
        return null;
      },
    }),
  ],
  session: {
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    signingKey: `{
      "kty": "oct",
      "kid": "${describe(JWT_SIGNING_KEY_ID)}",
      "alg": "HS512",
      "k": "${describe(JWT_SIGNING_KEY)}"
    }`,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          accessToken: user.accessToken.token,
          accessTokenExpires: Date.now() + +user.accessToken.expiresIn * 1000,
          refreshToken: user.refreshToken.token,
          name: token?.name,
          email: token?.email,
          error: "",
        };
      }
      // if (Date.now() < token.accessTokenExpires - 5000) {
      //   return token;
      // }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      const newSession: Session = { ...session };
      if (token) {
        newSession.user.name = token.name;
        newSession.accessToken = token.accessToken;
        newSession.refreshToken = token.refreshToken;
        newSession.user.email = token.email;
        newSession.error = token.error;
        newSession.expires = token.accessTokenExpires;
      }
      return newSession;
    },
    redirect({ url, baseUrl }) {
      switch (url) {
        case DASHBOARD_PATH:
          return `${baseUrl}${url}`;
        default:
          return url.startsWith(baseUrl) ? url : baseUrl;
      }
    },
  },
  pages: {
    signIn: AUTH_PATH,
    error: ERROR_500_PAGE,
  },
});
