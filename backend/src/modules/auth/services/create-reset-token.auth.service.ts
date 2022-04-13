import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
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

  public async emailBody(token: string, emailAddress: string) {
    const url = `${this.frontendUrl}?${token}`;
    await this.mailerService.sendMail({
      to: emailAddress,
      subject: 'You requested a password reset',
      html: `Trouble signing in?
      Resetting your password is easy.
      
      Just click <a href ="${url}"> here </a> to reset your password. We’ll have you up and running in no time.
      
      If you did not make this request then please ignore this email.`,
    });
    return { message: 'please check your email' };
  }

  public tokenGenerator(emailAddress: string, session: ClientSession) {
    const genToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();
    return this.resetModel
      .findOneAndUpdate(
        { emailAddress },
        {
          emailAddress,
          token: genToken,
          updatedAt: new Date(),
        },
        { upsert: true, new: true },
      )
      .session(session)
      .lean()
      .exec();
  }

  public tokenValidator(updatedAt: Date) {
    const isTokenInvalid =
      (new Date().getTime() - updatedAt.getTime()) / 60000 < 1;
    if (isTokenInvalid) {
      throw new Error('EMAIL_SENDED_RECENTLY');
    }
  }

  async create(emailAddress: string) {
    const session = await this.resetModel.db.startSession();
    session.startTransaction();

    try {
      const passwordModel = await this.resetModel.findOne({ emailAddress });
      if (!passwordModel) throw Error(INSERT_FAILED);
      this.tokenValidator(passwordModel?.updatedAt);

      const { token } = await this.tokenGenerator(emailAddress, session);
      if (token) {
        await session.commitTransaction();
        return await this.emailBody(token, emailAddress);
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
