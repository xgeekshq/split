import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ResetPassword, {
  ResetPasswordDocument,
} from '../../auth/schemas/reset-password.schema';
import { encrypt } from '../../../libs/utils/bcrypt';
import { UpdateUserService } from '../interfaces/services/update.user.service.interface';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class updateUserServiceImpl implements UpdateUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ResetPassword.name)
    private resetModel: Model<ResetPasswordDocument>,
  ) {}

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await encrypt(refreshToken);
    return this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $set: { currentHashedRefreshToken },
        },
      )
      .lean()
      .exec();
  }

  async setPassword(
    userEmail: string,
    newPassword: string,
    newPasswordConf: string,
  ) {
    const password = await encrypt(newPassword);
    if (newPassword !== newPasswordConf)
      throw new HttpException('PASSWORDS_DO_NOT_MATCH', HttpStatus.BAD_REQUEST);
    const user = await this.userModel.findOneAndUpdate(
      { email: userEmail },
      {
        $set: { password },
      },
    );
    if (!user) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    return user;
  }

  async checkEmail(token: string) {
    const userFromDb = await this.resetModel.findOne({ token });
    if (!userFromDb)
      throw new HttpException(
        'USER_FROM_TOKEN_NOT_FOUND',
        HttpStatus.NOT_FOUND,
      );
    this.tokenValidator(userFromDb.updatedAt);
    const user = await this.userModel.findOne({
      email: userFromDb.emailAddress,
    });
    if (!user) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    return user.email;
  }

  public tokenValidator(updatedAt: Date) {
    const isTokenValid =
      (new Date().getTime() - updatedAt.getTime()) / 1000 / 60 < 15;
    if (!isTokenValid) {
      throw new HttpException('EXPIRED_TOKEN', HttpStatus.BAD_REQUEST);
    }
  }
}
