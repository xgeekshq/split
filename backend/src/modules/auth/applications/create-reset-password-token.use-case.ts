import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { CreateResetPasswordTokenUseCaseInterface } from '../interfaces/applications/create-reset-token.use-case.interface';
import { TYPES } from '../interfaces/types';
import { ResetPasswordRepositoryInterface } from '../repository/reset-password.repository.interface';

@Injectable()
export class CreateResetPasswordTokenUseCase implements CreateResetPasswordTokenUseCaseInterface {
	constructor(
		private mailerService: MailerService,
		private configService: ConfigService,
		@Inject(TYPES.repository.ResetPasswordRepository)
		private readonly resetPasswordRepository: ResetPasswordRepositoryInterface
	) {}

	async execute(emailAddress: string) {
		await this.resetPasswordRepository.startTransaction();
		try {
			const passwordModel = await this.resetPasswordRepository.findPassword(emailAddress);

			if (passwordModel) {
				this.tokenValidator(passwordModel.updatedAt);
			}
			const { token } = await this.tokenGenerator(emailAddress, true);

			if (!token) {
				throw new InsertFailedException();
			}

			const res = await this.emailBody(token, emailAddress);
			await this.resetPasswordRepository.commitTransaction();

			return res;
		} catch (e) {
			await this.resetPasswordRepository.abortTransaction();

			return { message: e.message };
		} finally {
			await this.resetPasswordRepository.endSession();
		}
	}

	/* HELPERS */
	private async emailBody(token: string, emailAddress: string) {
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

	private tokenGenerator(emailAddress: string, session: boolean) {
		const genToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();

		return this.resetPasswordRepository.updateToken(emailAddress, genToken, session);
	}

	private tokenValidator(updatedAt: Date) {
		const isTokenInvalid = (new Date().getTime() - updatedAt.getTime()) / 60000 < 1;

		if (isTokenInvalid) {
			throw new Error('EMAIL_SENDED_RECENTLY');
		}
	}
}
