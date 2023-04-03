import { Test, TestingModule } from '@nestjs/testing';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Users from 'src/modules/users/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { duplicateBoardUseCase } from '../boards.providers';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Board from '../entities/board.schema';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { NotFoundException } from '@nestjs/common';
import faker from '@faker-js/faker';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { DuplicateBoardDto } from './duplicate-board.use-case';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { CreateFailedException } from 'src/libs/exceptions/createFailedBadRequestException';

const DEFAULT_PROPS = {
	boardId: faker.datatype.uuid(),
	userId: faker.datatype.uuid(),
	boardTitle: 'My Board'
};
const board = BoardFactory.create({
	_id: DEFAULT_PROPS.boardId,
	users: BoardUserDtoFactory.createMany(4)
});

describe('DuplicateBoardUseCase', () => {
	let duplicateBoardMock: UseCase<DuplicateBoardDto, Board>;
	let getUserServiceMock: DeepMocked<GetUserServiceInterface>;
	let getBoardServiceMock: DeepMocked<GetBoardServiceInterface>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let createBoardUserServiceMock: DeepMocked<CreateBoardUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				duplicateBoardUseCase,
				{
					provide: Users.TYPES.services.GetUserService,
					useValue: createMock<GetUserServiceInterface>()
				},
				{
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				},
				{
					provide: Boards.TYPES.repositories.BoardRepository,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: BoardUsers.TYPES.services.CreateBoardUserService,
					useValue: createMock<CreateBoardUserServiceInterface>()
				}
			]
		}).compile();

		duplicateBoardMock = module.get<UseCase<DuplicateBoardDto, Board>>(
			Boards.TYPES.applications.DuplicateBoardUseCase
		);

		getUserServiceMock = module.get(Users.TYPES.services.GetUserService);
		getBoardServiceMock = module.get(Boards.TYPES.services.GetBoardService);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		createBoardUserServiceMock = module.get(BoardUsers.TYPES.services.CreateBoardUserService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(duplicateBoardMock).toBeDefined();
	});

	describe('execute', () => {
		it('should throw an error if user not found', async () => {
			getUserServiceMock.getById.mockResolvedValueOnce(null);
			await expect(duplicateBoardMock.execute(DEFAULT_PROPS)).rejects.toThrowError(
				NotFoundException
			);
		});

		it('should throw an error if board not found', async () => {
			getBoardServiceMock.getBoard.mockResolvedValueOnce({ board: null });
			await expect(duplicateBoardMock.execute(DEFAULT_PROPS)).rejects.toThrowError(
				NotFoundException
			);
		});

		it('should call boardRepository.create', async () => {
			const user = UserFactory.create({ _id: DEFAULT_PROPS.userId });
			getUserServiceMock.getById.mockResolvedValueOnce(user);

			getBoardServiceMock.getBoard.mockResolvedValueOnce({ board });

			await duplicateBoardMock.execute(DEFAULT_PROPS);
			expect(boardRepositoryMock.create).toHaveBeenCalled();
		});

		it('should call createBoardUserService.saveBoardUsers', async () => {
			const user = UserFactory.create({ _id: DEFAULT_PROPS.userId });
			getUserServiceMock.getById.mockResolvedValueOnce(user);

			const board = BoardFactory.create({ _id: DEFAULT_PROPS.boardId });
			getBoardServiceMock.getBoard.mockResolvedValueOnce({ board });
			boardRepositoryMock.create.mockResolvedValueOnce(board);

			await duplicateBoardMock.execute(DEFAULT_PROPS);
			expect(createBoardUserServiceMock.saveBoardUsers).toHaveBeenCalled();
		});

		it('should throw an error if boardRepository.create fails', async () => {
			getBoardServiceMock.getBoard.mockResolvedValue({ board });
			boardRepositoryMock.create.mockResolvedValue(null);
			await expect(duplicateBoardMock.execute(DEFAULT_PROPS)).rejects.toThrowError(
				CreateFailedException
			);
		});
	});
});
