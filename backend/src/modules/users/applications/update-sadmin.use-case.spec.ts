import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { faker } from '@faker-js/faker';
import UpdateUserDto from '../dto/update.user.dto';
import { UserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/userDto-factory.mock';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import UpdateSAdminUseCaseDto from '../dto/useCase/update-sadmin.use-case.dto';
import User from '../entities/user.schema';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { USER_REPOSITORY } from 'src/modules/users/constants';
import UpdateSAdminUseCase from 'src/modules/users/applications/update-sadmin.use-case';

const user = UserFactory.create({ isSAdmin: true });
const userDto = UserDtoFactory.create();

const updateUserDto: UpdateUserDto = {
	_id: user._id,
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	email: user.email,
	isSAdmin: user.isSAdmin
};

const updatedUser = UserFactory.create({
	_id: user._id,
	firstName: updateUserDto.firstName,
	lastName: updateUserDto.lastName,
	email: user.email,
	isSAdmin: user.isSAdmin
});

describe('UpdateSAdminUseCase', () => {
	let updateSAdmin: UseCase<UpdateSAdminUseCaseDto, User>;
	let userRepositoryMock: DeepMocked<UserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateSAdminUseCase,
				{
					provide: USER_REPOSITORY,
					useValue: createMock<UserRepositoryInterface>()
				}
			]
		}).compile();

		updateSAdmin = module.get(UpdateSAdminUseCase);

		userRepositoryMock = module.get(USER_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(updateSAdmin).toBeDefined();
	});

	describe('execute', () => {
		it('should return updated super admin', async () => {
			userRepositoryMock.updateSuperAdmin.mockResolvedValue(updatedUser);
			await expect(
				updateSAdmin.execute({ user: updateUserDto, requestUser: userDto })
			).resolves.toEqual(updatedUser);
		});

		it('should throw update failed exception when request user is the user to update', async () => {
			const userDto2 = { ...userDto, _id: updateUserDto._id };
			await expect(
				updateSAdmin.execute({ user: updateUserDto, requestUser: userDto2 })
			).rejects.toThrowError(UpdateFailedException);
		});

		it('should throw update failed exception when user is not updated', async () => {
			userRepositoryMock.updateSuperAdmin.mockResolvedValue(null);
			await expect(
				updateSAdmin.execute({ user: updateUserDto, requestUser: userDto })
			).rejects.toThrowError(UpdateFailedException);
		});
	});
});
