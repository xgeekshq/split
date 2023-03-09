import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ClientSession, Model } from 'mongoose';
import { CreateResetTokenAuthServiceInterface } from '../interfaces/services/create-reset-token.auth.service.interface';
import ResetPassword, { ResetPasswordDocument } from '../entities/reset-password.schema';

@Injectable()
export default class CreateResetTokenAuthService implements CreateResetTokenAuthServiceInterface {
	constructor(
		@InjectModel(ResetPassword.name)
		private resetModel: Model<ResetPasswordDocument>,
		private mailerService: MailerService,
		private configService: ConfigService
	) {}

	public async emailBody(token: string, emailAddress: string) {
		const url = `${this.configService.get<string>('frontend.url')}/reset-password/${token}`;
		const msg = 'please check your email';
		await this.mailerService.sendMail({
			to: emailAddress,
			subject: 'You requested a password reset',
			html: `Trouble signing in?
      Resetting your password is easy.
      
      Just click <a href ="${url}"> here </a> to reset your password. We’ll have you up and running in no time.
      
      If you did not make this request then please ignore this email.`
		});

		return { message: msg };
	}

	public tokenGenerator(emailAddress: string, session: ClientSession) {
		const genToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();

		return this.resetModel
			.findOneAndUpdate(
				{ emailAddress },
				{
					emailAddress,
					token: genToken,
					updatedAt: new Date()
				},
				{ upsert: true, new: true }
			)
			.session(session)
			.lean()
			.exec();
	}

	public tokenValidator(updatedAt: Date) {
		const isTokenInvalid = (new Date().getTime() - updatedAt.getTime()) / 60000 < 1;

		if (isTokenInvalid) {
			throw new Error('EMAIL_SENDED_RECENTLY');
		}
	}

	async create(emailAddress: string) {
		const session = await this.resetModel.db.startSession();
		session.startTransaction();
		try {
			const passwordModel = await this.resetModel.findOne({ emailAddress });

			if (passwordModel) {
				this.tokenValidator(passwordModel.updatedAt);
			}
			const { token } = await this.tokenGenerator(emailAddress, session);

			if (!token) {
				throw new InternalServerErrorException();
			}

			const res = await this.emailBody(token, emailAddress);
			await session.commitTransaction();

			return res;
		} catch (e) {
			await session.abortTransaction();

			return { message: e.message };
		} finally {
			await session.endSession();
		}
	}
}
