import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import faker from '@faker-js/faker';
import { DELETE_TEAM_USER_SERVICE, GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { USER_REPOSITORY } from 'src/modules/users/constants';
import { DeleteUserUseCase } from 'src/modules/users/applications/delete-user.use-case';
import { userRepository as userRepositoryProvider } from '../users.providers';
import CreateUserService from '../services/create.user.service';
import { CreateUserServiceInterface } from '../interfaces/services/create.user.service.interface';
import User, { UserSchema } from '../entities/user.schema';
import * as mongoose from 'mongoose';
import { SoftDeletePlugin } from 'src/infrastructure/database/plugins/soft-delete.plugin';
import { getModelToken } from '@nestjs/mongoose';
import { DELETE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';

jest.mock('mongoose', () => {
	const actual = jest.requireActual('mongoose');

	const newObj = {
		...actual,
		connect: () => newObj
	};

	return newObj;
});

const userId = faker.datatype.uuid();
const userDeleted = UserFactory.create({ _id: userId });
const teamsOfUser = faker.datatype.number();

class UsersFindResult extends Array {
	toArray(cb: CallableFunction) {
		return cb(null, this);
	}
}

class UsersRepositoryHelper {
	private _users = new Map<string, User>();
	create(user: User) {
		this._users.set(user._id.toString(), user);
	}
	remove(id: string) {
		this._users.delete(id);
	}
	usersArray() {
		return Array.from(this._users.values());
	}
	delete(filter) {
		const { _id } = filter;

		this._users.delete(_id.toString());
	}
	find(filter) {
		let users = UsersFindResult.from(this._users.values());

		if ('isDeleted' in filter) {
			users = users.filter(
				(u) => (filter.isDeleted.$ne && !u.isDeleted) || (!filter.isDeleted.$ne && u.isDeleted)
			);
		}

		if ('_id' in filter) {
			if ('$in' in filter._id) {
				const filterStringIds = filter._id.$in.map((s) => s.toString());
				users = users.filter((u) => filterStringIds.includes(u._id.toString()));
			} else {
				users = users.filter((u) => u._id.toString() === filter._id.toString());
			}
		}

		return users;
	}
	updateOne(filter, updates) {
		const user = this.find(filter)[0];
		for (const [key, value] of Object.entries(updates.$set)) {
			if (key in user) {
				Reflect.set(user, key, value);
			}
		}

		return user;
	}
	updateMany(filter, updates) {
		const users = this.find(filter);
		for (const user of users) {
			for (const [key, value] of Object.entries(updates.$set)) {
				if (key in user) {
					Reflect.set(user, key, value);
				}
			}
		}

		return users;
	}
	deleteOne(filter) {
		const user = this.find(filter)[0];

		if (user) {
			this._users.delete(user._id);
		}
	}
	deleteMany(filter) {
		const users = this.find(filter);
		for (const user of users) {
			this._users.delete(user._id.toString());
		}
	}
}

const usersRepositoryHelper = new UsersRepositoryHelper();
describe('DeleteUserUseCase', () => {
	const collectionNative = (mongoose as any).__driver.Collection;
	const collectionProto = collectionNative.prototype;

	let createUserService: CreateUserServiceInterface;
	let userRepository: UserRepositoryInterface;
	let deleteUser: UseCase<string, boolean>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;
	let deleteTeamUserServiceMock: DeepMocked<DeleteTeamUserServiceInterface>;
	let deleteBoardUserServiceMock: DeepMocked<DeleteBoardUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: 'DATABASE_CONNECTION',
					useFactory: async (): Promise<typeof mongoose> => await mongoose.connect('')
				},
				{
					provide: getModelToken(User.name),
					useFactory: (connection: mongoose.Connection) => {
						const schema = UserSchema;
						schema.plugin(SoftDeletePlugin);

						return connection.model('User', schema);
					},
					inject: ['DATABASE_CONNECTION']
				},
				DeleteUserUseCase,
				CreateUserService,
				userRepositoryProvider,
				{
					provide: DELETE_TEAM_USER_SERVICE,
					useValue: createMock<DeleteTeamUserServiceInterface>()
				},
				{
					provide: GET_TEAM_USER_SERVICE,
					useValue: createMock<GetTeamUserServiceInterface>()
				},
				{
					provide: DELETE_BOARD_USER_SERVICE,
					useValue: createMock<DeleteBoardUserServiceInterface>()
				}
			]
		}).compile();

		createUserService = module.get(CreateUserService);
		deleteUser = module.get(DeleteUserUseCase);
		userRepository = module.get(USER_REPOSITORY);
		getTeamUserServiceMock = module.get(GET_TEAM_USER_SERVICE);
		deleteTeamUserServiceMock = module.get(DELETE_TEAM_USER_SERVICE);
		deleteBoardUserServiceMock = module.get(DELETE_BOARD_USER_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(deleteUser).toBeDefined();
	});

	describe('execute', () => {
		beforeAll(() => {
			userRepository.startTransaction = jest.fn();
			userRepository.commitTransaction = jest.fn();
			userRepository.endSession = jest.fn();
			userRepository.abortTransaction = jest.fn();
		});

		it('should return true', async () => {
			const spyDelete = jest.spyOn(userRepository, 'deleteUser').mockResolvedValueOnce(userDeleted);
			getTeamUserServiceMock.countTeamsOfUser.mockResolvedValue(teamsOfUser);
			deleteTeamUserServiceMock.deleteTeamUsersOfUser.mockResolvedValue(teamsOfUser);
			deleteBoardUserServiceMock.deleteBoardUserFromOpenBoards.mockResolvedValueOnce({});
			await expect(deleteUser.execute(userId)).resolves.toEqual(true);
			spyDelete.mockRestore();
		});

		it('should throw error when user is not deleted', async () => {
			await expect(deleteUser.execute(userId)).rejects.toThrowError(DeleteFailedException);
		});

		it('should throw error when commitTransaction fails', async () => {
			getTeamUserServiceMock.countTeamsOfUser.mockResolvedValue(teamsOfUser);
			deleteTeamUserServiceMock.deleteTeamUsersOfUser.mockResolvedValue(teamsOfUser);
			const spyDelete = jest.spyOn(userRepository, 'deleteUser').mockResolvedValueOnce(userDeleted);
			userRepository.commitTransaction = jest.fn().mockRejectedValueOnce(new Error());
			await expect(deleteUser.execute(userId)).rejects.toThrowError(DeleteFailedException);
			spyDelete.mockRestore();
		});
	});
	describe('integration', () => {
		it('should create and soft delete the user', async () => {
			//This will test various aspects of the softdelete plugin
			jest
				.spyOn(collectionProto, 'insertOne')
				.mockImplementation((doc, _options, callback: CallableFunction) => {
					usersRepositoryHelper.create(doc as User);
					callback(null, doc);
				});
			const email = faker.internet.email();
			const email2 = faker.internet.email();
			const userTest = await createUserService.create({
				email,
				firstName: 'test',
				lastName: 'test',
				password: 'test',
				providerAccountCreatedAt: new Date()
			});
			const userTest2 = await createUserService.create({
				email: email2,
				firstName: 'test2',
				lastName: 'test2',
				password: 'test2',
				providerAccountCreatedAt: new Date()
			});
			jest
				.spyOn(collectionProto, 'find')
				.mockImplementation((filter, _options, callback: CallableFunction) => {
					expect(filter).toHaveProperty('isDeleted');
					callback(null, usersRepositoryHelper.find(filter));
				});
			let users: Array<User> = await userRepository.getAllSignedUpUsers();
			expect(
				users.filter(
					(u) =>
						u._id.toString() === userTest._id.toString() ||
						u._id.toString() === userTest2._id.toString()
				)
			).toHaveLength(2);

			jest
				.spyOn(collectionProto, 'findOneAndDelete')
				.mockImplementationOnce((filter, _options, callback: CallableFunction) => {
					usersRepositoryHelper.deleteOne(filter);
					callback(null);
				});
			jest
				.spyOn(collectionProto, 'updateOne')
				.mockImplementation((filter, update, _options, callback: CallableFunction) => {
					const u = usersRepositoryHelper.updateOne(filter, update);
					callback(null, u);
				});
			jest
				.spyOn(collectionProto, 'findOne')
				.mockImplementation((filter, _options, callback: CallableFunction) => {
					const u = usersRepositoryHelper.find(filter);
					callback(null, u[0]);
				});
			await userRepository.deleteUser(userTest._id.toString(), true);
			users = await userRepository.getAllSignedUpUsers();
			expect(users.find((u) => u._id.toString() === userTest._id.toString())).toBeUndefined();
			expect(users.find((u) => u._id.toString() === userTest2._id.toString())).toBeDefined();

			users = await userRepository.findDeleted();
			expect(users).toHaveLength(1);
			jest
				.spyOn(collectionProto, 'updateMany')
				.mockImplementation((filter, update, _options, callback: CallableFunction) => {
					const users = usersRepositoryHelper.updateMany(filter, update);
					callback(null, { modifiedCount: users.length });
				});
			expect(await userRepository.restore({ _id: userTest._id.toString() })).toHaveProperty(
				'modifiedCount',
				1
			);
			expect(await userRepository.findAll()).toHaveLength(2);
			jest
				.spyOn(collectionProto, 'deleteMany')
				.mockImplementation((filter, options, callback: CallableFunction) => {
					usersRepositoryHelper.deleteMany(filter);
					callback(null);
				});
			await userRepository.forceDelete({
				_id: { $in: [userTest._id.toString(), userTest2._id.toString()] }
			});
			expect(await userRepository.findAll()).toHaveLength(0);
		});
	});
});
