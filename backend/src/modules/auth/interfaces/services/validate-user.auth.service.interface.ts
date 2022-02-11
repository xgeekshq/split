import { UserDocument } from '../../../users/schemas/user.schema';

export interface ValidateUserAuthService {
  validateUserWithCredentials(
    email: string,
    plainTextPassword: string,
  ): Promise<UserDocument>;
  validateUserById(userId: string): Promise<UserDocument>;
  validateUserByRefreshToken(
    authorization: string,
    userId: string,
  ): Promise<UserDocument>;
}
