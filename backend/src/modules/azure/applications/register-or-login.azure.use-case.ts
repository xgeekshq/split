import { Inject, Injectable } from '@nestjs/common';
import { RegisterOrLoginAzureUseCaseInterface } from '../interfaces/applications/register-or-login.azure.use-case.interface';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import { AUTH_AZURE_SERVICE } from '../constants';
import { AzureDecodedUser } from '../services/auth.azure.service';
import jwt_decode from 'jwt-decode';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import User from 'src/modules/users/entities/user.schema';
import * as AuthType from 'src/modules/auth/interfaces/types';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { signIn } from 'src/modules/auth/shared/login.auth';
import { createHash } from 'node:crypto';
import { StorageServiceInterface } from 'src/modules/storage/interfaces/services/storage.service';
import { CREATE_USER_SERVICE, GET_USER_SERVICE } from 'src/modules/users/constants';
import { STORAGE_SERVICE } from 'src/modules/storage/constants';

@Injectable()
export class RegisterOrLoginAzureUseCase implements RegisterOrLoginAzureUseCaseInterface {
	constructor(
		@Inject(AUTH_AZURE_SERVICE)
		private readonly authAzureService: AuthAzureServiceInterface,
		@Inject(GET_USER_SERVICE)
		private readonly getUserService: GetUserServiceInterface,
		@Inject(CREATE_USER_SERVICE)
		private readonly createUserService: CreateUserServiceInterface,
		@Inject(AuthType.TYPES.services.UpdateUserService)
		private readonly updateUserService: UpdateUserServiceInterface,
		@Inject(AuthType.TYPES.services.GetTokenAuthService)
		private readonly getTokenService: GetTokenAuthServiceInterface,
		@Inject(STORAGE_SERVICE)
		private readonly storageService: StorageServiceInterface
	) {}

	async execute(azureToken: string) {
		const { unique_name, email, name, given_name, family_name } = <AzureDecodedUser>(
			jwt_decode(azureToken)
		);

		const emailOrUniqueName = email ?? unique_name;

		const userFromAzure = await this.authAzureService.getUserFromAzure(emailOrUniqueName);

		if (!userFromAzure) return null;

		const user = await this.getUserService.getByEmail(emailOrUniqueName);

		let userToAuthenticate: User;

		if (user) {
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
}
