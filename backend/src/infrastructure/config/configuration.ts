import { Configuration } from './interfaces/configuration.interface';

export const DEFAULT_SERVER_PORT = 3200;

export const configuration = (): Configuration => {
	const NODE_ENV = process.env.NODE_ENV;
	const defaultConfiguration = {
		server: {
			port: parseInt(process.env.BACKEND_PORT as string, 10) || DEFAULT_SERVER_PORT
		},
		frontend: {
			url: process.env.NEXT_PUBLIC_NEXTAUTH_URL as string
		},
		database: {
			uri:
				NODE_ENV === 'local'
					? `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&replicaSet=${process.env.DB_REPLICA_SET}&readPreference=primary&directConnection=true`
					: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${process.env.DB_USER}@`
		},
		jwt: {
			accessToken: {
				secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
				expirationTime: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as string, 10)
			},
			refreshToken: {
				secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
				expirationTime: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as string, 10)
			}
		},
		azure: {
			clientId: process.env.AZURE_CLIENT_ID as string,
			clientSecret: process.env.AZURE_CLIENT_SECRET as string,
			tenantId: process.env.AZURE_TENANT_ID as string,
			enabled: process.env.AZURE_ENABLE === 'true',
			authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`
		},
		smtp: {
			host: process.env.SMTP_HOST as string,
			port: process.env.SMTP_PORT as unknown as number,
			user: process.env.SMTP_USER as string,
			password: process.env.SMTP_PASSWORD as string,
			enabled: process.env.STMP_ENABLE === 'true'
		},
		slack: {
			enable: process.env.SLACK_ENABLE === 'true',
			botToken: process.env.SLACK_API_BOT_TOKEN as string,
			masterChannelId: process.env.SLACK_MASTER_CHANNEL_ID as string,
			channelPrefix: process.env.SLACK_CHANNEL_PREFIX as string
		},
		redis: {
			user: process.env.REDIS_USER as string,
			password: process.env.REDIS_PASSWORD as string,
			host: process.env.REDIS_HOST as string,
			port: parseInt(process.env.REDIS_PORT as string, 10)
		},
		storage: {
			connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING as string
		}
	};

	return defaultConfiguration;
};
