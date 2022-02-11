import { UserDocument } from '../../schemas/user.schema';

export interface GetUserService {
  getByEmail(email: string): Promise<UserDocument | false>;
  getById(id: string): Promise<UserDocument>;
  getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<UserDocument | false>;
}
