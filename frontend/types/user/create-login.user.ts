import { Token } from "../token";

export interface CreateOrLogin {
  strategy?: string;
  email: string;
  id: string;
  accessToken: Token;
  refreshToken: Token;
  name: string;
}
