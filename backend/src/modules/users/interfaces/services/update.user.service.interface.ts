import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';

export interface UpdateUserService {
  setCurrentRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<LeanDocument<UserDocument> | null>;
}
