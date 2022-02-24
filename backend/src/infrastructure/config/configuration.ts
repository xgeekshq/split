import { Configuration } from './interfaces/configuration.interface';

export const DEFAULT_SERVER_PORT = 3200;

export const configuration = (): Configuration => {
  const defaultConfiguration = {
    server: {
      port:
        parseInt(process.env.SERVER_PORT as string, 10) || DEFAULT_SERVER_PORT,
    },
    database: {
      uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    },
    jwt: {
      accessToken: {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
        expirationTime: parseInt(
          process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as string,
          10,
        ),
      },
      refreshToken: {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
        expirationTime: parseInt(
          process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as string,
          10,
        ),
      },
    },
  };

  return defaultConfiguration;
};
