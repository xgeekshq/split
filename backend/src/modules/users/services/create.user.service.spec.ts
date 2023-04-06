import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { BadRequestException } from '@nestjs/common';
import { UserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/userDto-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { UserRepositoryInterface } from './../repository/user.repository.interface';
import { createUserService } from './../users.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import * as Users from 'src/modules/users/interfaces/types';
import CreateUserDto from '../dto/create.user.dto';
import User from '../entities/user.schema';

const createUserDto: CreateUserDto = UserDtoFactory.create() as unknown as CreateUserDto;

const createdUser: User = UserFactory.create({ ...createUserDto });

const createGuestUserDto: CreateGuestUserDto = {
	firstName: createdUser.firstName,
	lastName: createdUser.lastName
};

describe('CreateUserService', () => {
	let userService: CreateUserServiceInterface;
	let userRepositoryMock: DeepMocked<UserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createUserService,
				{
					provide: Users.TYPES.repository,
					useValue: createMock<UserRepositoryInterface>()
				}
			]
		}).compile();

		userService = module.get<CreateUserServiceInterface>(createUserService.provide);
		userRepositoryMock = module.get(Users.TYPES.repository);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
	});

	describe('create', () => {
		it('should create user', async () => {
			userRepositoryMock.create.mockResolvedValue(createdUser);
			await expect(userService.create(createUserDto)).resolves.toEqual(createdUser);
		});

		it('should throw error when user is not created', async () => {
			userRepositoryMock.create.mockResolvedValue(null);
			await expect(userService.create(createUserDto)).rejects.toThrowError(BadRequestException);
		});
	});

	describe('createGuest', () => {
		it('should create guest user', async () => {
			userRepositoryMock.create.mockResolvedValue(createdUser);
			await expect(userService.createGuest(createGuestUserDto)).resolves.toEqual(createdUser);
		});
		it('should throw error when user is not created', async () => {
			userRepositoryMock.create.mockResolvedValue(null);
			await expect(userService.createGuest(createGuestUserDto)).rejects.toThrowError(
				BadRequestException
			);
		});
	});
});
