import { Inject, Injectable } from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import isEmpty from 'src/libs/utils/isEmpty';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import * as AuthType from 'src/modules/auth/interfaces/types';
import * as StorageType from 'src/modules/storage/interfaces/types';
import { signIn } from 'src/modules/auth/shared/login.auth';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import * as UserType from 'src/modules/users/interfaces/types';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfigService } from '@nestjs/config';
import { AZURE_AUTHORITY, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } from 'src/libs/constants/azure';
import { createHash } from 'node:crypto';
import User from 'src/modules/users/entities/user.schema';
import { StorageServiceInterface } from 'src/modules/storage/interfaces/services/storage.service';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';

type AzureUserFound = {
	id: string;
	mail: string;
	displayName: string;
	userPrincipalName: string;
	createdDateTime: Date;
};

type AzureDecodedUser = {
	unique_name: string;
	email: string;
	given_name: string;
	family_name: string;
	name: string;
};

@Injectable()
export default class AuthAzureService implements AuthAzureServiceInterface {
	private graphClient: Client;
	private authCredentials: { accessToken: string; expiresOn: Date };

	constructor(
		@Inject(UserType.TYPES.services.CreateUserService)
		private readonly createUserService: CreateUserServiceInterface,
		@Inject(UserType.TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface,
		@Inject(AuthType.TYPES.services.UpdateUserService)
		private readonly updateUserService: UpdateUserServiceInterface,
		@Inject(AuthType.TYPES.services.GetTokenAuthService)
		private readonly getTokenService: GetTokenAuthServiceInterface,
		private readonly configService: ConfigService,
		@Inject(StorageType.TYPES.services.StorageService)
		private readonly storageService: StorageServiceInterface
	) {
		const confidentialClient = new ConfidentialClientApplication({
			auth: {
				clientId: configService.get(AZURE_CLIENT_ID),
				clientSecret: configService.get(AZURE_CLIENT_SECRET),
				authority: configService.get(AZURE_AUTHORITY)
			}
		});

		this.graphClient = Client.init({
			fetchOptions: {
				headers: { ConsistencyLevel: 'eventual' }
			},
			authProvider: async (done) => {
				if (this.authCredentials?.expiresOn >= new Date()) {
					return done(null, this.authCredentials.accessToken);
				}

				const { accessToken, expiresOn } = await confidentialClient.acquireTokenByClientCredential({
					scopes: ['https://graph.microsoft.com/.default']
				});

				this.authCredentials = { accessToken, expiresOn };
				done(null, accessToken);
			}
		});
	}

	async loginOrRegisterAzureToken(azureToken: string) {
		const { unique_name, email, name, given_name, family_name } = <AzureDecodedUser>(
			jwt_decode(azureToken)
		);

		const splitedName = name ? name.split(' ') : [];
		const firstName = given_name ?? splitedName[0] ?? 'first';
		const lastName = family_name ?? splitedName[splitedName.length - 1] ?? 'last';

		const emailOrUniqueName = email ?? unique_name;

		const userFromAzure = await this.getUserFromAzure(emailOrUniqueName);

		if (!userFromAzure) return null;

		const user = await this.getUserService.getByEmail(emailOrUniqueName);

		let userToAuthenticate: User;

		if (user) {
			userToAuthenticate = user;
		} else {
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

	async getUserFromAzure(email: string): Promise<AzureUserFound | undefined> {
		const { value } = await this.graphClient
			.api('/users')
			.select(['id', 'displayName', 'mail', 'userPrincipalName', 'createdDateTime'])
			.search(`"mail:${email}" OR "displayName:${email}" OR "userPrincipalName:${email}"`)
			.orderby('displayName')
			.get();

		return value[0];
	}

	async checkUserExistsInActiveDirectory(email: string) {
		const data = await this.getUserFromAzure(email);

		return !isEmpty(data);
	}

	private async getUserPhoto(user: User) {
		const { email, avatar } = user;
		const azureUser = await this.getUserFromAzure(email);

		if (!azureUser) return '';

		try {
			const blob = await this.graphClient.api(`/users/${azureUser.id}/photo/$value`).get();

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
