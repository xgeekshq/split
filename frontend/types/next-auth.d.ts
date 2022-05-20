/* eslint-disable @typescript-eslint/no-unused-vars */

declare module 'next-auth' {
	interface Session {
		user: {
			firstName: string;
			lastName: string;
			email: string;
			id: string;
		};
		accessToken: string;
		refreshToken?: string;
		expires: number;
		strategy: string;
		isSAdmin: boolean;
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
