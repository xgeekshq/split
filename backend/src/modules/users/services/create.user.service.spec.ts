import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { BadRequestException } from '@nestjs/common';
import { UserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/userDto-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { UserRepositoryInterface } from './../repository/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import CreateUserDto from '../dto/create.user.dto';
import User from '../entities/user.schema';
import { USER_REPOSITORY } from 'src/modules/users/constants';
import CreateUserService from 'src/modules/users/services/create.user.service';

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
				CreateUserService,
				{
					provide: USER_REPOSITORY,
					useValue: createMock<UserRepositoryInterface>()
				}
			]
		}).compile();

		userService = module.get(CreateUserService);
		userRepositoryMock = module.get(USER_REPOSITORY);
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
			userRepositoryMock.countDocumentsWithQuery.mockResolvedValue(0);
			await expect(userService.createGuest(createGuestUserDto)).resolves.toEqual(createdUser);
		});

		it('should create guest user when user is created with an existing email', async () => {
			userRepositoryMock.create.mockResolvedValue(createdUser);
			userRepositoryMock.countDocumentsWithQuery.mockResolvedValueOnce(1);
			userRepositoryMock.countDocumentsWithQuery.mockResolvedValueOnce(0);
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
