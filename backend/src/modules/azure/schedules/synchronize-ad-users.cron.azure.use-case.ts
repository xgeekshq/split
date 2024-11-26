import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SynchronizeADUsersCronUseCaseInterface } from '../interfaces/schedules/synchronize-ad-users.cron.azure.use-case.interface';
import { AUTH_AZURE_SERVICE } from '../constants';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import {
	CREATE_USER_SERVICE,
	DELETE_USER_USE_CASE,
	GET_ALL_USERS_INCLUDE_DELETED_USE_CASE
} from 'src/modules/users/constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import User from 'src/modules/users/entities/user.schema';
import { AzureUserDTO } from '../dto/azure-user.dto';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';

@Injectable()
export class SynchronizeADUsersCronUseCase implements SynchronizeADUsersCronUseCaseInterface {
	private readonly logger: Logger = new Logger(SynchronizeADUsersCronUseCase.name);
	constructor(
		@Inject(AUTH_AZURE_SERVICE)
		private readonly authAzureService: AuthAzureServiceInterface,
		@Inject(GET_ALL_USERS_INCLUDE_DELETED_USE_CASE)
		private readonly getAllUsersIncludeDeletedUseCase: UseCase<void, Array<User>>,
		@Inject(DELETE_USER_USE_CASE)
		private readonly deleteUserUseCase: UseCase<string, boolean>,
		@Inject(CREATE_USER_SERVICE)
		private readonly createUserService: CreateUserServiceInterface
	) {}

	//Runs every saturday at mid-night
	@Cron('0 0 * * 6')
	async execute() {
		try {
			const usersADAll = await this.authAzureService.getADUsers();

			if (!usersADAll.length) {
				throw new Error('Azure AD users list is empty.');
			}

			const usersApp = await this.getAllUsersIncludeDeletedUseCase.execute();

			if (!usersApp.length) {
				throw new Error('Split app users list is empty.');
			}

			const today = new Date();
			//Filter out users that don't have a '.' in the beggining of the email
			let usersADFiltered = usersADAll.filter((u) =>
				/[a-z]+\.[a-zA-Z0-9]+@/.test(u.userPrincipalName)
			);

			//Filter out users that have a deletedDateTime bigger than 'today'
			usersADFiltered = usersADFiltered.filter((u) =>
				'deletedDateTime' in u ? u.deletedDateTime === null || u.deletedDateTime >= today : true
			);

			//Filter out users that have a employeeLeaveDateTime bigger than 'today'
			usersADFiltered = usersADFiltered.filter((u) =>
				'employeeLeaveDateTime' in u
					? u.employeeLeaveDateTime === null || u.employeeLeaveDateTime >= today
					: true
			);

			await this.removeUsersFromApp(usersADFiltered, usersApp);
			await this.addUsersToApp(usersADFiltered, usersApp);
		} catch (err) {
			this.logger.error(
				`An error occurred while synchronizing users between AD and Aplit Application. Message: ${err.message}`
			);
		}
	}

	private async removeUsersFromApp(usersADFiltered: Array<AzureUserDTO>, usersApp: Array<User>) {
		const notIntersectedUsers = usersApp.filter(
			(userApp) =>
				userApp.isDeleted === false &&
				usersADFiltered.findIndex(
					(userAd) => (userAd.mail ?? userAd.userPrincipalName) === userApp.email
				) === -1
		);

		for (const user of notIntersectedUsers) {
			try {
				await this.deleteUserUseCase.execute(user._id);
			} catch (err) {
				this.logger.error(
					`An error occurred while deleting user with id '${user._id}' through the syncronize AD Users Cron. Message: ${err.message}`
				);
			}
		}
	}
	private async addUsersToApp(usersADFiltered: Array<AzureUserDTO>, usersApp: Array<User>) {
		const notIntersectedUsers = usersADFiltered.filter(
			(userAd) =>
				usersApp.findIndex(
					(userApp) => userApp.email === (userAd.mail ?? userAd.userPrincipalName)
				) === -1
		);

		for (const user of notIntersectedUsers) {
			try {
				const splittedName = user.displayName.split(' ');
				await this.createUserService.create({
					email: user.mail,
					firstName: splittedName[0],
					lastName: splittedName.at(-1),
					providerAccountCreatedAt: user.createdDateTime
				});
			} catch (err) {
				this.logger.error(
					`An error as occurred while creating user with email '${user.mail}' through the syncronize AD Users Cron. Message: ${err.message}`
				);
			}
		}
	}
}
