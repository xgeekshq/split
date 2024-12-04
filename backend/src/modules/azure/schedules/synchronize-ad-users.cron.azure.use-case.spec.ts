import { Test, TestingModule } from '@nestjs/testing';
import { AUTH_AZURE_SERVICE } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import { DeleteUserUseCase } from 'src/modules/users/applications/delete-user.use-case';
import {
	CREATE_USER_SERVICE,
	DELETE_USER_USE_CASE,
	GET_ALL_USERS_INCLUDE_DELETED_USE_CASE
} from 'src/modules/users/constants';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { AzureUserFactory } from 'src/libs/test-utils/mocks/factories/azure-user-factory';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import GetAllUsersIncludeDeletedUseCase from 'src/modules/users/applications/get-all-users-include-deleted.use-case';
import { SynchronizeADUsersCronUseCase } from './synchronize-ad-users.cron.azure.use-case';
import { GET_TEAM_BY_NAME_USE_CASE } from 'src/modules/teams/constants';
import { GetTeamByNameUseCase } from 'src/modules/teams/applications/get-team-by-name.use-case';
import { ADD_AND_REMOVE_TEAM_USER_USE_CASE } from 'src/modules/teamUsers/constants';
import { AddAndRemoveTeamUsersUseCase } from 'src/modules/teamUsers/applications/add-and-remove-team-users.use-case';
import CreateUserAzureDto from 'src/modules/users/dto/create.user.azure.dto';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import UpdateTeamUserDto from 'src/modules/teamUsers/dto/update.team.user.dto';
import { TeamRoles } from 'src/libs/enum/team.roles';
import { ConfigService } from '@nestjs/config';

const usersAD = AzureUserFactory.createMany(4, () => ({
	deletedDateTime: null,
	employeeLeaveDateTime: null
}));
const users = UserFactory.createMany(
	4,
	usersAD.map((u) => ({
		email: u.mail,
		firstName: u.displayName.split(' ')[0],
		lastName: u.displayName.split(' ')[1]
	})) as never
);
const team = TeamFactory.create({ name: 'xgeeks' });

describe('SynchronizeAdUsersCronUseCase', () => {
	let synchronizeADUsers: UseCase<void, void>;
	let authAzureServiceMock: DeepMocked<AuthAzureServiceInterface>;
	let getAllUsersMock: DeepMocked<GetAllUsersIncludeDeletedUseCase>;
	let deleteUserMock: DeepMocked<DeleteUserUseCase>;
	let createUserServiceMock: DeepMocked<CreateUserServiceInterface>;
	let getTeamByNameUseCase: DeepMocked<GetTeamByNameUseCase>;
	let addAndRemoveTeamUserUseCase: DeepMocked<AddAndRemoveTeamUsersUseCase>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SynchronizeADUsersCronUseCase,
				{
					provide: AUTH_AZURE_SERVICE,
					useValue: createMock<AuthAzureServiceInterface>()
				},
				{
					provide: GET_ALL_USERS_INCLUDE_DELETED_USE_CASE,
					useValue: createMock<GetAllUsersIncludeDeletedUseCase>()
				},
				{
					provide: DELETE_USER_USE_CASE,
					useValue: createMock<DeleteUserUseCase>()
				},
				{
					provide: CREATE_USER_SERVICE,
					useValue: createMock<CreateUserServiceInterface>()
				},
				{
					provide: GET_TEAM_BY_NAME_USE_CASE,
					useValue: createMock<GetTeamByNameUseCase>()
				},
				{
					provide: ADD_AND_REMOVE_TEAM_USER_USE_CASE,
					useValue: createMock<AddAndRemoveTeamUsersUseCase>()
				},
				{
					provide: ConfigService,
					useValue: {
						get: (key: string) => {
							switch (key) {
								case 'AD_SYNCHRONIZATION_AUTO_ADD_USER_TEAM_NAME':
									return 'xgeeks';

								case 'AD_SYNCHRONIZATION_EMAIL_DOMAIN':
									return 'xgeeks.com';

								default:
									return 'UNKNOWN';
							}
						}
					}
				}
			]
		}).compile();

		synchronizeADUsers = module.get(SynchronizeADUsersCronUseCase);
		authAzureServiceMock = module.get(AUTH_AZURE_SERVICE);
		getAllUsersMock = module.get(GET_ALL_USERS_INCLUDE_DELETED_USE_CASE);
		deleteUserMock = module.get(DELETE_USER_USE_CASE);
		createUserServiceMock = module.get(CREATE_USER_SERVICE);
		getTeamByNameUseCase = module.get(GET_TEAM_BY_NAME_USE_CASE);
		addAndRemoveTeamUserUseCase = module.get(ADD_AND_REMOVE_TEAM_USER_USE_CASE);
	});
	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(synchronizeADUsers).toBeDefined();
	});
	it('execute', async () => {
		const userNotInApp = AzureUserFactory.create({
			employeeLeaveDateTime: null,
			deletedDateTime: null
		});
		const azureUserDto: CreateUserAzureDto = {
			email: userNotInApp.mail,
			firstName: userNotInApp.displayName.split(' ')[0],
			lastName: userNotInApp.displayName.split(' ')[-1],
			providerAccountCreatedAt: userNotInApp.createdDateTime
		};
		const finalADUsers = [userNotInApp, ...usersAD];
		const userNotInAD = UserFactory.create({
			isDeleted: false,
			email: 'anything.anyone@xgeeks.com'
		});
		const finalAppUsers = [userNotInAD, ...users];
		const updateUsersTeam: UpdateTeamUserDto = {
			addUsers: [
				{
					role: TeamRoles.MEMBER,
					user: users[0]._id,
					canBeResponsible: false,
					isNewJoiner: true,
					team: team._id
				}
			],
			removeUsers: []
		};
		getTeamByNameUseCase.execute.mockResolvedValueOnce(team);
		authAzureServiceMock.getADUsers.mockResolvedValueOnce(finalADUsers);
		getAllUsersMock.execute.mockResolvedValueOnce(finalAppUsers);
		createUserServiceMock.createMany.mockResolvedValueOnce([users[0]]);

		//act
		await synchronizeADUsers.execute();
		expect(getTeamByNameUseCase.execute).toHaveBeenCalledWith('xgeeks');
		expect(deleteUserMock.execute).toHaveBeenCalledWith(userNotInAD._id);
		expect(createUserServiceMock.createMany).toHaveBeenCalledWith([azureUserDto]);
		expect(addAndRemoveTeamUserUseCase.execute).toHaveBeenCalledWith(updateUsersTeam);
	});
});
