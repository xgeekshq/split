import { Token } from 'src/libs/interfaces/jwt/token.interface';
import { Tokens } from 'src/libs/interfaces/jwt/tokens.interface';

export interface GetTokenAuthService {
	getNewPassword(newPassword: string);

	getTokens(userId: string): Promise<Tokens | null>;

	getAccessToken(userId: string): Token;

	getRefreshToken(userId: string): Token;
}
