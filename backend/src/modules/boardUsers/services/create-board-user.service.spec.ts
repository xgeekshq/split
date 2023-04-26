import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateBoardUserServiceInterface } from '../interfaces/services/create.board.user.service.interface';
import CreateBoardUserService from './create.board.user.service';
import { BOARD_USER_REPOSITORY } from '../constants';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import BoardUserDto from '../dto/board.user.dto';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';

const createBoardUserDtos: BoardUserDto[] = BoardUserDtoFactory.createMany(4);

const createdBoardUsers: TeamUser[] = BoardUserFactory.createMany(4, [
	{ ...createBoardUserDtos[0] },
	{ ...createBoardUserDtos[1] },
	{ ...createBoardUserDtos[2] },
	{ ...createBoardUserDtos[3] }
]);

const teamId = faker.datatype.uuid();

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
	});

	it('should be defined', () => {
		expect(boardUserService).toBeDefined();
	});

	describe('saveBoardUsers', () => {
		it('should create board users', async () => {
			boardUserRepositoryMock.createBoardUsers.mockResolvedValue(createdBoardUsers);
			await expect(
				boardUserService.saveBoardUsers(createBoardUserDtos, faker.datatype.uuid())
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
		it('should create board users', async () => {
			boardUserRepositoryMock.create.mockResolvedValue(createdBoardUsers[0]);
			await expect(
				boardUserService.createBoardUser(createBoardUserDtos[0], faker.datatype.uuid())
			).resolves.toStrictEqual(createdBoardUsers);
		});

		it('should throw Bad Request when team users are not created', async () => {
			boardUserRepositoryMock.create.mockResolvedValue(null);
			await expect(boardUserService.createBoardUser(createBoardUserDtos)).rejects.toThrow(
				BadRequestException
			);
		});
	});
});
