import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateBoardUserServiceInterface } from '../interfaces/services/create.board.user.service.interface';
import CreateBoardUserService from './create.board.user.service';
import { BOARD_USER_REPOSITORY } from '../constants';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import BoardUserDto from '../dto/board.user.dto';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import BoardUser from '../entities/board.user.schema';
import { BoardRoles } from 'src/libs/enum/board.roles';

const createBoardUserDtos: BoardUserDto[] = BoardUserDtoFactory.createMany(4);

const createdBoardUsers: BoardUser[] = BoardUserFactory.createMany(4, [
	{ ...createBoardUserDtos[0] },
	{ ...createBoardUserDtos[1] },
	{ ...createBoardUserDtos[2] },
	{ ...createBoardUserDtos[3] }
]);

describe('CreateBoardUserService', () => {
	let boardUserService: CreateBoardUserServiceInterface;
	let boardUserRepositoryMock: DeepMocked<BoardUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateBoardUserService,
				{
					provide: BOARD_USER_REPOSITORY,
					useValue: createMock<BoardUserRepositoryInterface>()
				}
			]
		}).compile();

		boardUserService = module.get(CreateBoardUserService);
		boardUserRepositoryMock = module.get(BOARD_USER_REPOSITORY);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		boardUserRepositoryMock.findOneByField.mockResolvedValue(null);
		boardUserRepositoryMock.create.mockResolvedValue(null);
		boardUserRepositoryMock.findOneByField.mockResolvedValue(null);
	});

	it('should be defined', () => {
		expect(boardUserService).toBeDefined();
	});

	describe('saveBoardUsers', () => {
		it('should create board users', async () => {
			boardUserRepositoryMock.createBoardUsers.mockResolvedValue(createdBoardUsers);
			await expect(
				boardUserService.saveBoardUsers(createBoardUserDtos, faker.string.uuid())
			).resolves.toStrictEqual(createdBoardUsers);
		});

		it('should throw Bad Request when team users are not created', async () => {
			boardUserRepositoryMock.createBoardUsers.mockResolvedValue([]);
			await expect(boardUserService.saveBoardUsers(createBoardUserDtos)).rejects.toThrow(
				BadRequestException
			);
		});
	});

	describe('createBoardUser', () => {
		it('should create board user', async () => {
			const user = faker.string.uuid();
			const boardUser: BoardUser = BoardUserFactory.create({ user });
			boardUser.role = BoardRoles.MEMBER;

			boardUserRepositoryMock.findOneByField.mockResolvedValue(null);
			boardUserRepositoryMock.create.mockResolvedValue(boardUser);

			await expect(
				boardUserService.createBoardUser(boardUser.board as string, user)
			).resolves.toStrictEqual(boardUser);
		});

		it('should throw Bad Request when board user already exists', async () => {
			boardUserRepositoryMock.findOneByField.mockResolvedValue(createdBoardUsers[0]);
			await expect(
				boardUserService.createBoardUser(createdBoardUsers[0].board as string, faker.string.uuid())
			).rejects.toThrowError(BadRequestException);
		});

		it('should throw Bad Request when board user is not created', async () => {
			boardUserRepositoryMock.findOneByField.mockResolvedValue(null);
			boardUserRepositoryMock.create.mockResolvedValue(null);
			await expect(
				boardUserService.createBoardUser(createBoardUserDtos[0].board, faker.string.uuid())
			).rejects.toThrowError(BadRequestException);
		});
	});
});
