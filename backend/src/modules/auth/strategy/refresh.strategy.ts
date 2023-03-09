import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_TOKEN_SECRET } from 'src/libs/constants/jwt';
import { INVALID_CREDENTIALS } from 'src/libs/exceptions/messages';
import TokenPayload from 'src/libs/interfaces/jwt/token-payload.interface';
import { ValidateUserAuthServiceInterface } from '../interfaces/services/validate-user.auth.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export default class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh-token'
) {
	constructor(
		private readonly configService: ConfigService,
		@Inject(TYPES.services.ValidateAuthService)
		private readonly validateUserAuthService: ValidateUserAuthServiceInterface
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get(JWT_REFRESH_TOKEN_SECRET),
			passReqToCallback: true,
			ignoreExpiration: false
		});
	}

	async validate(request: Request, payload: TokenPayload) {
		const { authorization } = request.headers;

		const user = await this.validateUserAuthService.validateUserByRefreshToken(
			authorization,
			payload.userId
		);

		if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);

		return user;
	}
}
