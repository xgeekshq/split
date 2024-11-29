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

describe('SynchronizeAdUsersCronUseCase', () => {
	let synchronizeADUsers: UseCase<void, void>;
	let authAzureServiceMock: DeepMocked<AuthAzureServiceInterface>;
	let getAllUsersMock: DeepMocked<GetAllUsersIncludeDeletedUseCase>;
	let deleteUserMock: DeepMocked<DeleteUserUseCase>;
	let createUserServiceMock: DeepMocked<CreateUserServiceInterface>;
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
				}
			]
		}).compile();

		synchronizeADUsers = module.get(SynchronizeADUsersCronUseCase);
		authAzureServiceMock = module.get(AUTH_AZURE_SERVICE);
		getAllUsersMock = module.get(GET_ALL_USERS_INCLUDE_DELETED_USE_CASE);
		deleteUserMock = module.get(DELETE_USER_USE_CASE);
		createUserServiceMock = module.get(CREATE_USER_SERVICE);
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
		const finalADUsers = [userNotInApp, ...usersAD];
		authAzureServiceMock.getADUsers.mockResolvedValueOnce(finalADUsers);
		const userNotInAD = UserFactory.create({ isDeleted: false });
		const finalAppUsers = [userNotInAD, ...users];
		getAllUsersMock.execute.mockResolvedValueOnce(finalAppUsers);
		await synchronizeADUsers.execute();
		expect(deleteUserMock.execute).toHaveBeenCalledWith(userNotInAD._id);
		expect(createUserServiceMock.create).toHaveBeenCalledWith({
			email: userNotInApp.mail,
			firstName: userNotInApp.displayName.split(' ')[0],
			lastName: userNotInApp.displayName.split(' ')[1],
			providerAccountCreatedAt: userNotInApp.createdDateTime
		});
	});
});
