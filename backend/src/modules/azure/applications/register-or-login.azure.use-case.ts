import { Inject, Injectable, Logger } from '@nestjs/common';
import { RegisterOrLoginAzureUseCaseInterface } from '../interfaces/applications/register-or-login.azure.use-case.interface';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import { AUTH_AZURE_SERVICE } from '../constants';
import { AzureDecodedUser } from '../services/auth.azure.service';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import User from 'src/modules/users/entities/user.schema';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { signIn } from 'src/modules/auth/shared/login.auth';
import { createHash } from 'node:crypto';
import { StorageServiceInterface } from 'src/modules/storage/interfaces/services/storage.service';
import { CREATE_USER_SERVICE, GET_USER_SERVICE } from 'src/modules/users/constants';
import { STORAGE_SERVICE } from 'src/modules/storage/constants';
import { GET_TOKEN_AUTH_SERVICE, UPDATE_USER_SERVICE } from 'src/modules/auth/constants';
import { JwksClient } from 'jwks-rsa';
import { AZURE_CLIENT_ID, AZURE_WELLKNOWN } from 'src/libs/constants/azure';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class RegisterOrLoginAzureUseCase implements RegisterOrLoginAzureUseCaseInterface {
	private readonly logger: Logger = new Logger(RegisterOrLoginAzureUseCase.name);

	constructor(
		@Inject(AUTH_AZURE_SERVICE)
		private readonly authAzureService: AuthAzureServiceInterface,
		@Inject(GET_USER_SERVICE)
		private readonly getUserService: GetUserServiceInterface,
		@Inject(CREATE_USER_SERVICE)
		private readonly createUserService: CreateUserServiceInterface,
		@Inject(UPDATE_USER_SERVICE)
		private readonly updateUserService: UpdateUserServiceInterface,
		@Inject(GET_TOKEN_AUTH_SERVICE)
		private readonly getTokenService: GetTokenAuthServiceInterface,
		@Inject(STORAGE_SERVICE)
		private readonly storageService: StorageServiceInterface,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	async execute(azureToken: string) {
		const validAccessToken = await this.validateAccessToken(azureToken);

		if (!validAccessToken) {
			return null;
		}
		const { unique_name, email, name, given_name, family_name } = <AzureDecodedUser>(
			validAccessToken
		);

		const emailOrUniqueName = email ?? unique_name;

		const userFromAzure = await this.authAzureService.getUserFromAzure(emailOrUniqueName);

		if (!userFromAzure) return null;

		//This will check if user exists, and if the acount is disabled
		if (
			!userFromAzure ||
			!userFromAzure.accountEnabled ||
			(userFromAzure.deletedDateTime !== null && userFromAzure.deletedDateTime <= new Date())
		) {
			return null;
		}

		const user = await this.getUserService.getByEmail(emailOrUniqueName, true);

		let userToAuthenticate: User;

		if (user) {
			if (user.isDeleted) {
				await this.updateUserService.restoreUser(user._id);
			}
			userToAuthenticate = user;
		} else {
			const splitedName = name ? name.split(' ') : [];
			const firstName = given_name ?? splitedName[0] ?? 'first';
			const lastName = family_name ?? splitedName.at(-1) ?? 'last';

			const createdUser = await this.createUserService.create({
				email: emailOrUniqueName,
				firstName,
				lastName,
				providerAccountCreatedAt: userFromAzure.createdDateTime
			});

			if (!createdUser) return null;

			userToAuthenticate = createdUser;
		}

		const avatarUrl = await this.getUserPhoto(userToAuthenticate);

		if (avatarUrl) {
			await this.updateUserService.updateUserAvatar(userToAuthenticate._id, avatarUrl);

			userToAuthenticate.avatar = avatarUrl;
		}

		return signIn(userToAuthenticate, this.getTokenService, 'azure');
	}

	private async getUserPhoto(user: User) {
		const { email, avatar } = user;
		const azureUser = await this.authAzureService.getUserFromAzure(email);

		if (!azureUser) return '';

		try {
			const blob = await this.authAzureService.fetchUserPhoto(azureUser.id);

			const buffer = Buffer.from(await blob.arrayBuffer());
			const hash = createHash('md5').update(buffer).digest('hex');

			if (avatar) {
				const avatarHash = avatar.split('/').pop().split('.').shift();

				if (avatarHash === hash) return;

				await this.storageService.deleteFile(avatar);
			}

			return this.storageService.uploadFile(hash, {
				buffer,
				mimetype: blob.type,
				originalname: `${hash}.${blob.type.split('/').pop()}`
			});
		} catch (ex) {
			return '';
		}
	}

	/**
	 * Validate Azure access token using issuer public key
	 * @param token
	 * @returns false or decoded token payload
	 */
	private async validateAccessToken(token: string): Promise<Record<string, any> | boolean> {
		try {
			//Use wellknown to get issuer and jwks uri's
			const wellKnown = this.configService.get(AZURE_WELLKNOWN);

			const { data } = await axios.get(wellKnown);

			const client = new JwksClient({
				jwksUri: data.jwks_uri
			});

			const { header } = this.jwtService.decode(token, { complete: true }) as {
				header: any;
				payload: any;
				signature: any;
			};

			if (!header) {
				return false;
			}

			const secret = await client.getSigningKey(header.kid);

			const decodedToken = await this.jwtService.verifyAsync(token, {
				algorithms: ['RS256'],
				audience: this.configService.get(AZURE_CLIENT_ID),
				secret: secret.getPublicKey(),
				complete: true,
				issuer: data.issuer
			});

			if (decodedToken) {
				const { payload } = decodedToken;

				return payload;
			}
		} catch (err) {
			this.logger.error(
				`An error occurred while validating azure access token. Message: ${err.message}`
			);
		}

		return false;
	}
}
