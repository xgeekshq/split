import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import User, { UserDocument } from './schemas/user.schema';
import CreateUserDto from './dto/createUser.dto';
import { compare, encrypt } from '../../utils/bcrypt';
import {
  USER_NOT_FOUND,
  TOKENS_NOT_MATCHING,
  DELETE_FAILED,
} from '../../constants/httpExceptions';

@Injectable()
export default class UsersService {
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
    throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    if (!user.currentHashedRefreshToken)
      throw new HttpException(TOKENS_NOT_MATCHING, 401);

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) return user;
    throw new HttpException(TOKENS_NOT_MATCHING, 401);
  }

  create(userData: CreateUserDto) {
    return this.userModel.create(userData);
  }

  async delete(email: string) {
    const result = await this.userModel.deleteOne({ email }).exec();
    if (result) return true;
    throw new HttpException(DELETE_FAILED, 401);
  }

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
