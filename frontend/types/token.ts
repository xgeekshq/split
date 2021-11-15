export interface AccessToken {
  [accessToken: string]: { token: string; expiresIn: string };
}
export interface RefreshToken {
  [refreshToken: string]: { token: string; expiresIn: string };
}
