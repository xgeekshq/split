import { Token } from 'libs/interfaces/jwt/token.interface';

export interface AzureToken extends Omit<Token, 'expiresIn'> {}
