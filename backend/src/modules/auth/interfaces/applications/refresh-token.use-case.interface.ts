import { Token } from 'src/libs/interfaces/jwt/token.interface';

export interface RefreshTokenUseCaseInterface {
	execute(userId: string): Promise<Token>;
}
