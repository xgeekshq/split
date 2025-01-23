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
import { AzureUserDTO, AzureUserSyncDTO } from '../dto/azure-user.dto';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { GET_TEAM_BY_NAME_USE_CASE } from 'src/modules/teams/constants';
import Team from 'src/modules/teams/entities/team.schema';
import { ADD_AND_REMOVE_TEAM_USER_USE_CASE } from 'src/modules/teamUsers/constants';
import UpdateTeamUserDto from 'src/modules/teamUsers/dto/update.team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { TeamRoles } from 'src/libs/enum/team.roles';
import CreateUserAzureDto from 'src/modules/users/dto/create.user.azure.dto';
import { ConfigService } from '@nestjs/config';

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
		private readonly createUserService: CreateUserServiceInterface,
		@Inject(GET_TEAM_BY_NAME_USE_CASE)
		private readonly getTeamByNameUseCase: UseCase<string, Team>,
		@Inject(ADD_AND_REMOVE_TEAM_USER_USE_CASE)
		private readonly addAndRemoveTeamUserUseCase: UseCase<UpdateTeamUserDto, TeamUser[]>,
		private readonly configService: ConfigService
	) {}

	//Runs every saturday at mid-night
	@Cron('0 0 * * 6')
	async execute() {
		try {
			let team;
			const teamName = this.configService.get('AD_SYNCHRONIZATION_AUTO_ADD_USER_TEAM_NAME');
			const userEmailDomain = this.configService.get('AD_SYNCHRONIZATION_EMAIL_DOMAIN');

			if (teamName !== '') {
				team = await this.getTeamByNameUseCase.execute(teamName);

				if (!team) {
					throw new Error(`Error retrieving '${teamName}' team.`);
				}
			}
			const usersADAll = await this.authAzureService.getADUsers();

			if (!usersADAll.length) {
				throw new Error('Azure AD users list is empty.');
			}

			let usersApp = await this.getAllUsersIncludeDeletedUseCase.execute();

			if (userEmailDomain) {
				const emailDomain = '@' + userEmailDomain;
				usersApp = usersApp.filter((user) => user.email && user.email.endsWith(emailDomain));
			}

			const today = new Date();

			//Filter out users that don't have a '.' in the beggining of the email
			let usersADFiltered = usersADAll.filter((u) =>
				/[a-z]+\.[a-zA-Z0-9]+@/.test(u.userPrincipalName)
			);

			//Filter out users that don't have at least first and last name
			usersADFiltered = usersADFiltered.filter(
				(u: AzureUserSyncDTO) =>
					!(u.displayName.split(' ').length < 2 && (!u.givenName || !u.surName))
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
			await this.addUsersToApp(usersADFiltered, usersApp, team);

			this.logger.log('Synchronization of users between App and AD runned successfully.');
		} catch (err) {
			this.logger.error(
				`An error occurred while synchronizing users between AD and Split Application. Message: ${err.message}`
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
	private async addUsersToApp(
		usersADFiltered: Array<AzureUserSyncDTO>,
		usersApp: Array<User>,
		team: Team
	) {
		const notIntersectedUsers = usersADFiltered.filter(
			(userAd) =>
				usersApp.findIndex(
					(userApp) => userApp.email === (userAd.mail ?? userAd.userPrincipalName)
				) === -1
		);

		try {
			const usersToCreate: Array<CreateUserAzureDto> = notIntersectedUsers
				.map((user) => {
					const splittedName = user.displayName.split(' ');
					const firstName = user.givenName?.split(' ')[0] ?? splittedName[0];
					const lastName = user.surName?.split(' ').at(-1) ?? splittedName.at(-1);

					return {
						email: user.mail ?? user.userPrincipalName,
						firstName,
						lastName,
						providerAccountCreatedAt: user.createdDateTime
					};
				})
				.filter((u) => u.firstName && u.lastName);

			const createdUsers = await this.createUserService.createMany(usersToCreate);

			if (team) {
				const updateTeamUser: UpdateTeamUserDto = {
					addUsers: createdUsers.map((user) => {
						return {
							role: TeamRoles.MEMBER,
							user: user._id,
							canBeResponsible: false,
							isNewJoiner: true,
							team: team._id
						};
					}),
					removeUsers: []
				};
				this.addAndRemoveTeamUserUseCase.execute(updateTeamUser);
			}
		} catch (err) {
			this.logger.error(
				`An error as occurred while creating users through the syncronize AD Users Cron. Message: ${err.message}`
			);
		}
	}
}
