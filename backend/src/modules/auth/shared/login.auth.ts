import UserDto from 'src/modules/users/dto/user.dto';
import UserModel from 'src/modules/users/entities/user';
import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import { GetTokenAuthService } from '../interfaces/services/get-token.auth.service.interface';

export const signIn = async (
	user: UserModel | UserDto,
	getTokenService: GetTokenAuthService | GetTokenAuthApplication,
	strategy: string
) => {
	const { email, firstName, lastName, _id, isSAdmin } = user;
	const jwt = await getTokenService.getTokens(_id);

	if (!jwt) return null;

	return { ...jwt, email, firstName, lastName, strategy, _id, isSAdmin };
};
