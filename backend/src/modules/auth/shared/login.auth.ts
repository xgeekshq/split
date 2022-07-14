import { LeanDocument } from 'mongoose';

import UserDto from 'modules/users/dto/user.dto';
import { UserDocument } from 'modules/users/schemas/user.schema';

import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import { GetTokenAuthService } from '../interfaces/services/get-token.auth.service.interface';

export const signIn = async (
	user: LeanDocument<UserDocument> | UserDto,
	getTokenService: GetTokenAuthService | GetTokenAuthApplication,
	strategy: string
) => {
	const { email, firstName, lastName, _id, isSAdmin } = user;
	const jwt = await getTokenService.getTokens(_id);

	if (!jwt) return null;

	return { ...jwt, email, firstName, lastName, strategy, id: _id, isSAdmin };
};
