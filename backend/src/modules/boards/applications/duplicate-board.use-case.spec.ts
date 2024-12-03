import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Board from '../entities/board.schema';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { DuplicateBoardDto, DuplicateBoardUseCase } from './duplicate-board.use-case';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { CreateFailedException } from 'src/libs/exceptions/createFailedBadRequestException';
import { BOARD_REPOSITORY, GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import { CREATE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';
import { GET_USER_SERVICE } from 'src/modules/users/constants';

const DEFAULT_PROPS = {
	boardId: faker.string.uuid(),
	userId: faker.string.uuid(),
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
				DuplicateBoardUseCase,
				{
					provide: GET_USER_SERVICE,
					useValue: createMock<GetUserServiceInterface>()
				},
				{
					provide: GET_BOARD_SERVICE,
					useValue: createMock<GetBoardServiceInterface>()
				},
				{
					provide: BOARD_REPOSITORY,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: CREATE_BOARD_USER_SERVICE,
					useValue: createMock<CreateBoardUserServiceInterface>()
				}
			]
		}).compile();

		duplicateBoardMock = module.get(DuplicateBoardUseCase);

		getUserServiceMock = module.get(GET_USER_SERVICE);
		getBoardServiceMock = module.get(GET_BOARD_SERVICE);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
		createBoardUserServiceMock = module.get(CREATE_BOARD_USER_SERVICE);
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
