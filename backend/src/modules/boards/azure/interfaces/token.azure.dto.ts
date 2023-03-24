import { Token } from 'src/libs/interfaces/jwt/token.interface';

export type AzureToken = Omit<Token, 'expiresIn'>;
