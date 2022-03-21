import { LeanDocument } from 'mongoose';
import UserDto from '../../users/dto/user.dto';
import { UserDocument } from '../../users/schemas/user.schema';
import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import { GetTokenAuthService } from '../interfaces/services/get-token.auth.service.interface';

export const signIn = async (
  user: LeanDocument<UserDocument> | UserDto,
  getTokenService: GetTokenAuthService | GetTokenAuthApplication,
  strategy: string,
) => {
  const jwt = await getTokenService.getTokens(user._id);
  if (!jwt) return null;
  return {
    ...jwt,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    strategy,
    id: user._id,
  };
};
