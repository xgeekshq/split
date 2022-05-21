import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

import { createOrLoginUserAzure, login, refreshAccessToken } from '../../../api/authService';
import { Token } from '../../../types/token';
import { LoginUser, User } from '../../../types/user/user';
import {
	CLIENT_ID,
	CLIENT_SECRET,
	NEXT_PUBLIC_NEXTAUTH_URL,
	REFRESH_TOKEN_ERROR,
	SECRET,
	TENANT_ID,
	UNDEFINED
} from '../../../utils/constants';
import { DASHBOARD_ROUTE, ERROR_500_PAGE, START_PAGE_ROUTE } from '../../../utils/routes';

async function getNewAccessToken(prevToken: JWT) {
	try {
		const data: Token = await refreshAccessToken(prevToken.refreshToken);
		return {
			...prevToken,
			accessToken: data.token,
			accessTokenExpires: Date.now() + +data.expiresIn * 1000,
			error: ''
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
			tenantId: TENANT_ID
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				const loginUser: LoginUser = {
					email: credentials?.email,
					password: credentials?.password
				};
				const data: User = await login(loginUser);
				if (data) {
					const token = {
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.email,
						id: data.id,
						accessToken: data.accessToken?.token,
						refreshToken: data.refreshToken?.token,
						isSAdmin: data.isSAdmin
					};
					return token;
				}
				return null;
			}
		})
	],
	secret: SECRET,
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60
	},
	jwt: {
		secret: SECRET
	},
	callbacks: {
		async signIn({ account, user }) {
			if (account.provider === 'azure-ad') {
				const { access_token: azureAccessToken } = account;
				const data = await createOrLoginUserAzure(azureAccessToken ?? '');
				if (!data) return false;
				const { firstName, lastName, accessToken, refreshToken, email, id, isSAdmin } =
					data;
				user.firstName = firstName;
				user.lastName = lastName;
				user.accessToken = accessToken.token;
				user.accessTokenExpiresIn = accessToken.expiresIn;
				user.refreshToken = refreshToken.token;
				user.email = email;
				user.strategy = 'azure';
				user.id = id;
				user.isSAdmin = isSAdmin;
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
					firstName: user.firstName,
					lastName: user.lastName,
					email: token.email,
					strategy: user.strategy ?? 'local',
					error: '',
					isSAdmin: user.isSAdmin
				};
			}
			if (Date.now() < token.accessTokenExpires - 5000) {
				return token;
			}
			return getNewAccessToken(token);
		},
		async session({ session, token }) {
			const newSession: Session = { ...session };
			if (token) {
				newSession.user.firstName = token.firstName;
				newSession.user.lastName = token.lastName;
				newSession.accessToken = token.accessToken;
				newSession.refreshToken = token.refreshToken;
				newSession.user.email = token.email;
				newSession.user.id = token.id;
				newSession.error = token.error;
				newSession.expires = token.accessTokenExpires;
				newSession.strategy = token.strategy;
				newSession.isSAdmin = token.isSAdmin;
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
		}
	},
	pages: {
		signIn: START_PAGE_ROUTE,
		error: ERROR_500_PAGE
	}
});
