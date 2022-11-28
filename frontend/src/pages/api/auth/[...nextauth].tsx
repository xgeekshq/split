import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

import { createOrLoginUserAzure, login, refreshAccessToken } from '@/api/authService';
import { Token } from '@/types/token';
import { LoginUser } from '@/types/user/user';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  NEXT_PUBLIC_NEXTAUTH_URL,
  REFRESH_TOKEN_ERROR,
  SECRET,
  TENANT_ID,
  UNDEFINED,
} from '@/utils/constants';
import { DASHBOARD_ROUTE, ERROR_500_PAGE, START_PAGE_ROUTE } from '@/utils/routes';

async function getNewAccessToken(prevToken: JWT): Promise<JWT> {
  try {
    const data: Token = await refreshAccessToken(prevToken.user.refreshToken.token);
    return {
      ...prevToken,
      accessToken: { token: data.token, expiresIn: String(Date.now() + +data.expiresIn * 1000) },
      error: '',
    };
  } catch (error) {
    return { ...prevToken, error: REFRESH_TOKEN_ERROR };
  }
}

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: CLIENT_ID ?? UNDEFINED,
      clientSecret: CLIENT_SECRET ?? UNDEFINED,
      tenantId: TENANT_ID,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const loginUser: LoginUser = {
          email: credentials?.email,
          password: credentials?.password,
        };
        const data = await login(loginUser);
        const { firstName, lastName, isSAdmin, accessToken, refreshToken, _id, email } = data || {};
        if (!_id || !accessToken || !refreshToken) return null;

        const token = {
          firstName,
          lastName,
          isSAdmin,
          accessToken,
          refreshToken,
          id: _id,
          email,
          strategy: 'local',
        };
        return token;
      },
    }),
  ],
  secret: SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: SECRET,
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account && account.provider === 'azure-ad') {
        const { access_token: azureAccessToken } = account;

        const data = await createOrLoginUserAzure(azureAccessToken ?? '');

        if (!data) return false;


        const {
          firstName,
          lastName,
          accessToken,
          refreshToken,
          email,
          id,
          isSAdmin,
          userAzureCreatedAt,
        } = data;
        user.firstName = firstName;
        user.lastName = lastName;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.email = email;
        user.strategy = 'azure';
        user.id = _id;
        user.isSAdmin = isSAdmin;
        user.userAzureCreatedAt = userAzureCreatedAt || undefined;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        const jwt: JWT = {
          user: {
            accessToken: {
              token: user.accessToken.token,
              expiresIn: String(Date.now() + +user.accessToken.expiresIn * 1000),
            },
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email ?? '',
            isSAdmin: user.isSAdmin,
            refreshToken: user.refreshToken,
          },
          strategy: user.strategy ?? 'local',
          error: '',
        };

        return jwt;
      }

      if (Date.now() < +token.user.accessToken.expiresIn - 5000) {
        return token;
      }

      return getNewAccessToken(token);
    },
    async session({ session, token }) {
      let newSession: Session = { ...session };

      if (token) {
        newSession = { ...token, expires: token.user.accessToken.expiresIn };
      }

      return newSession;
    },
    redirect({ url, baseUrl }) {
      switch (url) {
        case DASHBOARD_ROUTE:
          return `${baseUrl}${url}`;
        case `/logoutAzure`:
          return `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${NEXT_PUBLIC_NEXTAUTH_URL}`;
        default:
          return url.startsWith(baseUrl) ? url : baseUrl;
      }
    },
  },
  pages: {
    signIn: START_PAGE_ROUTE,
    error: ERROR_500_PAGE,
  },
});
