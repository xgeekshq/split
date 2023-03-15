import UserDto from 'src/modules/users/dto/user.dto';
import User from 'src/modules/users/entities/user.schema';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';

export const signIn = async (
	user: User | UserDto,
	getTokenService: GetTokenAuthServiceInterface,
	strategy: string
) => {
	const { email, firstName, lastName, _id, isSAdmin, providerAccountCreatedAt, avatar } = user;
	const jwt = await getTokenService.getTokens(_id);

	if (!jwt) return null;

	return {
		...jwt,
		email,
		firstName,
		lastName,
		strategy,
		id: _id,
		isSAdmin,
		providerAccountCreatedAt,
		_id,
		avatar
	};
};
