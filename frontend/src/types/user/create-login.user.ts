import { Token } from '../token';

export interface CreateOrLogin {
  strategy?: string;
  email: string;
  _id: string;
  accessToken: Token;
  refreshToken: Token;
  firstName: string;
  lastName: string;
  isSAdmin: boolean;
}
