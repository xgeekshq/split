export interface Configuration {
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
