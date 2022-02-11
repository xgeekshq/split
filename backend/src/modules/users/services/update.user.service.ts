import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encrypt } from '../../../libs/utils/bcrypt';
import { UpdateUserService } from '../interfaces/services/update.user.service.interface';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class UpdateUserServiceImpl implements UpdateUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await encrypt(refreshToken);
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: { currentHashedRefreshToken },
      },
    );
  }
}
