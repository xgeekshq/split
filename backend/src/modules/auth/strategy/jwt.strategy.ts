import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/libs/constants/jwt';
import { INVALID_CREDENTIALS } from 'src/libs/exceptions/messages';
import TokenPayload from 'src/libs/interfaces/jwt/token-payload.interface';
import { ValidateUserAuthService } from '../interfaces/services/validate-user.auth.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@Inject(TYPES.services.ValidateAuthService)
		private readonly validateUserAuthService: ValidateUserAuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get(JWT_ACCESS_TOKEN_SECRET),
			ignoreExpiration: false
		});
	}

	async validate(payload: TokenPayload) {
		const user = await this.validateUserAuthService.validateUserById(payload.userId);

		if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);

		return user;
	}
}
