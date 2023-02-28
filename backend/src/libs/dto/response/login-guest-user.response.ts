import { Token } from 'src/libs/interfaces/jwt/token.interface';

export class LoginGuestUserResponse {
	accessToken: Token;
	user: string;
}
