import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import GetBoardUseCaseDto from '../dto/useCase/get-board.use-case.dto';
import BoardUseCasePresenter from '../presenter/board.use-case.presenter';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/userDto-factory.mock';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { Tokens } from 'src/libs/interfaces/jwt/tokens.interface';
import { hideVotesFromColumns } from '../utils/hideVotesFromColumns';
import { GetBoardUseCase } from './get-board.use-case';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';
import {
	CREATE_BOARD_USER_SERVICE,
	GET_BOARD_USER_SERVICE
} from 'src/modules/boardUsers/constants';
import { GET_TOKEN_AUTH_SERVICE } from 'src/modules/auth/constants';
import { UPDATE_USER_SERVICE } from 'src/modules/users/constants';

const mainBoard = BoardFactory.create({ isSubBoard: false, isPublic: false });
const subBoard = BoardFactory.create({ isSubBoard: true, isPublic: false });
const boardUser = BoardUserFactory.create({ board: subBoard._id });
const userDtoMock = UserDtoFactory.create({ isSAdmin: false, isAnonymous: false });
let getTokenAuthServiceMock: DeepMocked<GetTokenAuthServiceInterface>;

describe('GetBoardUseCase', () => {
	let useCase: UseCase<GetBoardUseCaseDto, BoardUseCasePresenter>;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetBoardUseCase,
				{
					provide: BOARD_REPOSITORY,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: GET_BOARD_USER_SERVICE,
					useValue: createMock<GetBoardUserServiceInterface>()
				},
				{
					provide: CREATE_BOARD_USER_SERVICE,
					useValue: createMock<CreateBoardUserServiceInterface>()
				},
				{
					provide: GET_TOKEN_AUTH_SERVICE,
					useValue: createMock<GetTokenAuthServiceInterface>()
				},
				{
					provide: UPDATE_USER_SERVICE,
					useValue: createMock<UpdateUserServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(GetBoardUseCase);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
		getBoardUserServiceMock = module.get(GET_BOARD_USER_SERVICE);
		getTokenAuthServiceMock = module.get(GET_TOKEN_AUTH_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();

		boardRepositoryMock.getBoardData.mockResolvedValue(subBoard);
		getBoardUserServiceMock.getBoardUser.mockResolvedValue(boardUser);
		boardRepositoryMock.getMainBoard.mockResolvedValue(mainBoard);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should call boardRepository', async () => {
			await boardRepositoryMock.getBoardData(mainBoard._id);

			expect(boardRepositoryMock.getBoardData).toBeCalledTimes(1);
			expect(boardRepositoryMock.getBoardData).toBeCalledWith(mainBoard._id);
		});

		it('should throw error if board is not found ', async () => {
			boardRepositoryMock.getBoardData.mockResolvedValue(null);
			expect(
				async () => await useCase.execute({ boardId: '-1', user: userDtoMock })
			).rejects.toThrow(NotFoundException);
		});

		it('should return board and main board if is a subBoard', async () => {
			const boardResult = await useCase.execute({ boardId: subBoard._id, user: userDtoMock });

			//format columns to hideVotes that is called on clean board function
			subBoard.columns = hideVotesFromColumns(subBoard.columns, String(userDtoMock._id));

			const response = { board: subBoard, mainBoard };

			expect(boardResult).toEqual(response);
		});

		it('should throw error if mainBoard is not found ', async () => {
			boardRepositoryMock.getMainBoard.mockResolvedValueOnce(null);
			expect(
				async () => await useCase.execute({ boardId: subBoard._id, user: userDtoMock })
			).rejects.toThrow(NotFoundException);
		});

		it('should return board and guestUser if is a guestUser', async () => {
			const board = { ...mainBoard, isPublic: true };
			const userDto = { ...userDtoMock, isSAdmin: false, isAnonymous: true };

			const boardUser = BoardUserFactory.create();
			const tokens: Tokens = {
				accessToken: {
					expiresIn: String(faker.number.int()),
					token: faker.lorem.word()
				},
				refreshToken: {
					expiresIn: String(faker.number.int()),
					token: faker.lorem.word()
				}
			};

			boardRepositoryMock.getBoardData.mockResolvedValue(board);
			getBoardUserServiceMock.getBoardUser.mockResolvedValue(null);
			getTokenAuthServiceMock.getTokens.mockResolvedValue(tokens);
			getBoardUserServiceMock.getBoardUserPopulated.mockResolvedValue(boardUser);

			board.columns = hideVotesFromColumns(board.columns, userDto._id);

			const boardResponse = {
				guestUser: { accessToken: tokens.accessToken, user: userDto._id },
				board
			};

			const boardResult = await useCase.execute({
				boardId: board._id,
				user: userDto,
				completionHandler() {
					return;
				}
			});

			expect(boardResult).toEqual(boardResponse);
		});

		it('should return a board when boardUserIsFound', async () => {
			const board = { ...mainBoard };
			const userDto = { ...userDtoMock, isSAdmin: false, isAnonymous: true };

			boardRepositoryMock.getBoardData.mockResolvedValue(board);

			//format columns to hideVotes that is called on clean board function
			board.columns = hideVotesFromColumns(board.columns, userDtoMock._id);

			const boardResult = await useCase.execute({ boardId: board._id, user: userDto });

			expect(boardResult.board).toEqual(board);
		});

		it('should return a board when boardIsPublic, boardUser is not found and userDto is not anonymous', async () => {
			const board = { ...mainBoard, isPublic: true };

			boardRepositoryMock.getBoardData.mockResolvedValue(board);
			getBoardUserServiceMock.getBoardUser.mockResolvedValue(null);

			//format columns to hideVotes that is called on clean board function
			board.columns = hideVotesFromColumns(board.columns, userDtoMock._id);

			const boardResult = await useCase.execute({
				boardId: board._id,
				user: userDtoMock,
				completionHandler() {
					return;
				}
			});

			expect(boardResult.board).toEqual(board);
		});

		it('should throw error when boardIsPublic and creating a board user fails', async () => {
			const board = { ...mainBoard, isPublic: true };

			boardRepositoryMock.getBoardData.mockResolvedValue(board);
			getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce(null);
			getBoardUserServiceMock.getBoardUserPopulated.mockResolvedValueOnce(null);

			expect(
				async () => await useCase.execute({ boardId: board._id, user: userDtoMock })
			).rejects.toThrow(BadRequestException);
		});
	});
});
