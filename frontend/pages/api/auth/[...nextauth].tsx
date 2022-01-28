import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { REFRESH_TOKEN_ERROR, SECRET } from "../../../utils/constants";
import { LoginUser, User } from "../../../types/user";
import { login, refreshToken } from "../../../api/authService";
import { Token } from "../../../types/token";
import { AUTH_ROUTE, DASHBOARD_ROUTE, ERROR_500_PAGE } from "../../../utils/routes";

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
          return {
            name: data.name,
            email: data.email,
            accessToken: { ...data.accessToken },
            refreshToken: { ...data.refreshToken },
          };
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
        case DASHBOARD_ROUTE:
          return `${baseUrl}${url}`;
        default:
          return url.startsWith(baseUrl) ? url : baseUrl;
      }
    },
  },
  pages: {
    signIn: AUTH_ROUTE,
    error: ERROR_500_PAGE,
  },
});
