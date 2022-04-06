import { AzureConfiguration } from './azure.configuration.interface';

export interface Configuration extends AzureConfiguration {
  smtp: {
    enabled: boolean;
    host: string;
    port: number;
    user: string;
    password: string;
  };
  server: {
    port: number;
  };
  database: {
    uri: string;
  };
  jwt: {
    accessToken: {
      secret: string;
      expirationTime: number;
    };
    refreshToken: {
      secret: string;
      expirationTime: number;
    };
  };
}
