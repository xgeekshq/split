import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';

export interface UpdateUserService {
  setCurrentRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<LeanDocument<UserDocument> | null>;
  setPassword(
    userEmail: string,
    newPassword: string,
  ): Promise<UserDocument | null>;
  checkEmail(token: string): Promise<string>;
}
