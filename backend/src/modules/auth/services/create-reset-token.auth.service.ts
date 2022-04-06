import { MailerService } from '@nestjs-modules/mailer';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResetTokenAuthService } from '../interfaces/services/create-reset-token.auth.service.interface';
import ResetPassword, {
  ResetPasswordDocument,
} from '../schemas/reset-password.schema';

@Injectable()
export default class CreateResetTokenAuthServiceImpl
  implements CreateResetTokenAuthService
{
  constructor(
    @InjectModel(ResetPassword.name)
    private resetModel: Model<ResetPasswordDocument>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  private frontendUrl = this.configService.get<string>('frontend.url');

  async create(emailAddress: string) {
    const session = await this.resetModel.db.startSession();
    session.startTransaction();

    try {
      const forgottenPassword = await this.resetModel.findOne({ emailAddress });
      const isTokenInvalid =
        forgottenPassword &&
        (new Date().getTime() - forgottenPassword.updatedAt.getTime()) / 60000 <
          1;
      if (isTokenInvalid) {
        throw new HttpException(
          'RESET_PASSWORD.EMAIL_SENDED_RECENTLY',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const genToken = (
        Math.floor(Math.random() * 9000000) + 1000000
      ).toString();
      const resetPasswordModel = await this.resetModel
        .findOneAndUpdate(
          { emailAddress },
          {
            emailAddress,
            token: genToken,
            updatedAt: new Date(),
          },
          { upsert: true, new: true },
        )
        .lean()
        .exec();
      if (resetPasswordModel) {
        const url = `${this.frontendUrl}?${resetPasswordModel.token}`;
        await this.mailerService.sendMail({
          to: emailAddress,
          subject: 'reset your password',
          html: `click <a href ="${url}"> here </a> to reset your password`,
        });
        return { message: 'please check your email' };
      }
      throw new InternalServerErrorException();
    } catch (e) {
      await session.abortTransaction();
      return { message: e.message };
    } finally {
      await session.endSession();
    }
  }
}
