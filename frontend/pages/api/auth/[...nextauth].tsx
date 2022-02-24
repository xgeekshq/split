import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import { JWT } from "next-auth/jwt";
import {
  AUTH_PATH,
  CLIENTID,
  CLIENTSECRET,
  DASHBOARD_PATH,
  ERROR_500_PAGE,
  SECRET,
  TENANTID,
  UNDEFINED,
  NEXT_PUBLIC_NEXTAUTH_URL,
  REFRESH_TOKEN_ERROR,
} from "../../../utils/constants";
import { LoginUser, User } from "../../../types/user/user";
import { createOrLoginUserAzure, login, refreshToken } from "../../../api/authService";
import { Token } from "../../../types/token";

async function refreshAccessToken(prevToken: JWT) {
  try {
    const data: Token = await refreshToken(prevToken.refreshToken);
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
    AzureADProvider({
      clientId: CLIENTID ?? UNDEFINED,
      clientSecret: CLIENTSECRET ?? UNDEFINED,
      tenantId: TENANTID,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const loginUser: LoginUser = {
          email: credentials?.email,
          password: credentials?.password,
        };
        const data: User = await login(loginUser);
        if (data) {
          const token = {
            name: data.name,
            email: data.email,
            id: data.id,
            accessToken: data.accessToken?.token,
            refreshToken: data.refreshToken?.token,
          };
          return token;
        }
        return null;
      },
    }),
  ],
  secret: SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: SECRET,
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account.provider === "azure-ad") {
        const { access_token: accessToken } = account;
        const data = await createOrLoginUserAzure(accessToken ?? "");
        if (!data) return false;
        user.name = data.name;
        user.accessToken = data.accessToken.token;
        user.accessTokenExpiresIn = data.accessToken.expiresIn;
        user.refreshToken = data.refreshToken.token;
        user.email = data.email;
        user.strategy = "azure";
        user.id = data.id;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          accessToken: user.accessToken,
          accessTokenExpires: Date.now() + +user.accessTokenExpiresIn * 1000,
          refreshToken: user.refreshToken,
          id: user.id,
          name: token?.name,
          email: token?.email,
          strategy: user.strategy,
          error: "",
        };
      }
      if (Date.now() < token.accessTokenExpires - 5000) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      const newSession: Session = { ...session };
      if (token) {
        newSession.user.name = token.name;
        newSession.accessToken = token.accessToken;
        newSession.refreshToken = token.refreshToken;
        newSession.user.email = token.email;
        newSession.user.id = token.id;
        newSession.error = token.error;
        newSession.expires = token.accessTokenExpires;
        newSession.strategy = token.strategy;
      }
      return newSession;
    },
    redirect({ url, baseUrl }) {
      switch (url) {
        case DASHBOARD_PATH:
          return `${baseUrl}${url}`;
        case `/logoutAzure`:
          return `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${NEXT_PUBLIC_NEXTAUTH_URL}`;
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
