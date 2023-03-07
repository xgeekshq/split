import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	JWT_ACCESS_TOKEN_EXPIRATION_TIME,
	JWT_ACCESS_TOKEN_SECRET,
	JWT_REFRESH_TOKEN_EXPIRATION_TIME,
	JWT_REFRESH_TOKEN_SECRET
} from 'src/libs/constants/jwt';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import { GetTokenAuthServiceInterface } from '../interfaces/services/get-token.auth.service.interface';

@Injectable()
export default class GetTokenAuthService implements GetTokenAuthServiceInterface {
	constructor(
		@Inject(TYPES.services.UpdateUserService)
		private updateUserService: UpdateUserServiceInterface,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async getTokens(userId: string) {
		const accessToken = this.getAccessToken(userId);
		const refreshToken = this.getRefreshToken(userId);
		const user = await this.updateUserService.setCurrentRefreshToken(refreshToken.token, userId);

		if (!user) return null;

		return {
			accessToken,
			refreshToken
		};
	}

	async getNewPassword(newPassword: string) {
		return this.getNewPassword(newPassword);
	}

	public getAccessToken(userId: string) {
		const token = this.jwtService.sign(
			{ userId },
			{
				secret: this.configService.get(JWT_ACCESS_TOKEN_SECRET),
				expiresIn: `${this.configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`
			}
		);

		return {
			expiresIn: this.configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
			token
		};
	}

	public getRefreshToken(userId: string) {
		const token = this.jwtService.sign(
			{ userId },
			{
				secret: this.configService.get(JWT_REFRESH_TOKEN_SECRET),
				expiresIn: `${this.configService.get(JWT_REFRESH_TOKEN_EXPIRATION_TIME)}d`
			}
		);

		return {
			expiresIn: this.configService.get(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
			token
		};
	}
}
