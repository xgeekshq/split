import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from '../../../libs/utils/bcrypt';
import { USER_NOT_FOUND } from '../../../libs/exceptions/messages';
import { GetUserService } from '../interfaces/services/get.user.service.interface';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class GetUserServiceImpl implements GetUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) return user;
    return false;
  }

  async getById(_id: string) {
    const user = await this.userModel
      .findById(_id)
      .select(['-password'])
      .exec();
    if (user) return user;
    throw new NotFoundException(USER_NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    if (!user.currentHashedRefreshToken) return false;

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) return user;
    return false;
  }
}
