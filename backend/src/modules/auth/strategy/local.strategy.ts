import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LeanDocument } from 'mongoose';
import { Strategy } from 'passport-local';
import { INVALID_CREDENTIALS } from 'src/libs/exceptions/messages';
import { UserDocument } from 'src/modules/users/entities/user.schema';
import { ValidateUserAuthServiceInterface } from '../interfaces/services/validate-user.auth.service.interface';
import { VALIDATE_AUTH_SERVICE } from '../constants';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(VALIDATE_AUTH_SERVICE)
		private readonly validateUserAuthService: ValidateUserAuthServiceInterface
	) {
		super({
			usernameField: 'email'
		});
	}

	async validate(email: string, password: string): Promise<LeanDocument<UserDocument> | null> {
		const user = await this.validateUserAuthService.validateUserWithCredentials(email, password);

		if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);

		return user;
	}
}
