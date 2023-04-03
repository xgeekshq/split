import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { getBoardUserService } from '../../boardUsers/boardusers.providers';
import { getBoardService } from './../boards.providers';
import { getTokenAuthService } from './../../auth/auth.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { getTeamService } from 'src/modules/teams/providers';
import { updateUserService } from 'src/modules/users/users.providers';
import { boardRepository } from '../boards.providers';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Auth from 'src/modules/auth/interfaces/types';
import faker from '@faker-js/faker';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { Tokens } from 'src/libs/interfaces/jwt/tokens.interface';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { createBoardUserService } from 'src/modules/boardUsers/boardusers.providers';
import { hideVotes } from '../utils/clean-boards.spec';
import Column from 'src/modules/columns/entities/column.schema';
import { UserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/userDto-factory.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const userId = faker.datatype.uuid();
const mainBoard = BoardFactory.create({ isSubBoard: false, isPublic: false });
const subBoard = BoardFactory.create({ isSubBoard: true, isPublic: false });
const boardUser = BoardUserFactory.create({ board: subBoard._id });
const userDtoMock = UserDtoFactory.create({ isSAdmin: false, isAnonymous: false });
const boards = BoardFactory.createMany(4);
const teams = TeamFactory.createMany(2);
const teamIds = teams.map((team) => team._id);
const boardIds = boards.map((board) => board._id);
const getBoardAndTeamIdsResult = { boardIds, teamIds };

const hideVotesFromColumns = (columns: Column[], userId: string) => {
	return columns.map((column) => {
		column.cards.forEach((card) => {
			card.votes = hideVotes(card.votes as string[], userId);
			card.items.forEach(
				(cardItem) => (cardItem.votes = hideVotes(cardItem.votes as string[], userId))
			);
		});

		return column;
	});
};

describe('GetBoardService', () => {
	let boardService: GetBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let getTeamServiceMock: DeepMocked<GetTeamServiceInterface>;
	let getTokenAuthServiceMock: DeepMocked<GetTokenAuthServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getBoardService,
				{
					provide: getTeamService.provide,
					useValue: createMock<GetTeamServiceInterface>()
				},
				{
					provide: createBoardUserService.provide,
					useValue: createMock<CreateBoardUserServiceInterface>()
				},
				{
					provide: getTokenAuthService.provide,
					useValue: createMock<GetTokenAuthServiceInterface>()
				},
				{
					provide: updateUserService.provide,
					useValue: createMock<UpdateUserServiceInterface>()
				},
				{
					provide: getBoardUserService.provide,
					useValue: createMock<GetBoardUserServiceInterface>()
				},
				{
					provide: boardRepository.provide,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				}
			]
		}).compile();

		boardService = module.get<GetBoardServiceInterface>(getBoardService.provide);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		getBoardUserServiceMock = module.get(BoardUsers.TYPES.services.GetBoardUserService);
		getTeamServiceMock = module.get(Teams.TYPES.services.GetTeamService);
		getTokenAuthServiceMock = module.get(Auth.TYPES.services.GetTokenAuthService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();

		boardRepositoryMock.getBoardData.mockResolvedValue(subBoard);
		getBoardUserServiceMock.getBoardUser.mockResolvedValue(boardUser);
		boardRepositoryMock.getMainBoard.mockResolvedValue(mainBoard);
	});

	it('should be defined', () => {
		expect(boardService).toBeDefined();
	});

	describe('getAllBoardIdsAndTeamIdsOfUser', () => {
		it('should call boardUserRepository and getTeamService', async () => {
			await boardService.getAllBoardIdsAndTeamIdsOfUser(userId);
			expect(getBoardUserServiceMock.getAllBoardsOfUser).toBeCalledTimes(1);
			expect(getBoardUserServiceMock.getAllBoardsOfUser).toBeCalledWith(userId);

			expect(getTeamServiceMock.getTeamsOfUser).toBeCalledTimes(1);
			expect(getTeamServiceMock.getTeamsOfUser).toBeCalledWith(userId);
		});

		it('should return boardIds and teamIds', async () => {
			const boardUsers = BoardUserFactory.createMany(3);
			const teams = TeamFactory.createMany(2).map((team) => {
				return { ...team, boardsCount: 0 };
			});
			const boardIds = boardUsers.map((boardUser) => boardUser.board);
			const teamIds = teams.map((team) => team._id);
			const boardAndTeamIdsResult = { boardIds, teamIds };

			getBoardUserServiceMock.getAllBoardsOfUser.mockResolvedValue(boardUsers);
			getTeamServiceMock.getTeamsOfUser.mockResolvedValue(teams);

			const result = await boardService.getAllBoardIdsAndTeamIdsOfUser(userId);

			expect(result).toEqual(boardAndTeamIdsResult);
		});
	});

	describe('getBoards', () => {
		it('should call board repository', async () => {
			const boards = BoardFactory.createMany(3);

			const teamIds = [TeamFactory.create()._id];
			boards[0].team = teamIds[0];
			const boardIds = boards.map((board) => board._id);
			const getBoardAndTeamIdsResult = { boardIds, teamIds };
			const filterBoardsResponse = boards.filter(
				(board) =>
					board.isSubBoard && (boardIds.includes(board._id) || teamIds.includes(String(board.team)))
			);

			//mock response from getAllBoardIdAndTeamIdsOfUSer
			jest
				.spyOn(boardService, 'getAllBoardIdsAndTeamIdsOfUser')
				.mockResolvedValueOnce(getBoardAndTeamIdsResult);

			//mock returned values from calls to repo on private function getBoards
			boardRepositoryMock.getCountPage.mockResolvedValue(1);

			//the mock result is filtered with the same query that it's passed as argument
			boardRepositoryMock.getAllBoards.mockResolvedValue(filterBoardsResponse);

			const query = {
				$and: [
					{ isSubBoard: false },
					{ $or: [{ _id: { $in: boardIds } }, { team: { $ne: null } }] }
				]
			};

			await boardService.getBoards(true, query, 0, 10);

			expect(boardRepositoryMock.getCountPage).toBeCalledTimes(1);
			expect(boardRepositoryMock.getAllBoards).toBeCalledTimes(1);
		});
	});

	describe('getPersonalUserBoards', () => {
		it('should be defined', () => {
			expect(boardService.getPersonalUserBoards).toBeDefined();
		});

		it('should call getAllBoardsIdsAndTeamIdsOfUser', async () => {
			const userId = faker.datatype.uuid();

			jest.spyOn(boardService, 'getAllBoardIdsAndTeamIdsOfUser');

			await boardService.getAllBoardIdsAndTeamIdsOfUser(userId);

			expect(boardService.getAllBoardIdsAndTeamIdsOfUser).toBeCalledTimes(1);
			expect(boardService.getAllBoardIdsAndTeamIdsOfUser).toBeCalledWith(userId);
		});

		it('should return all personal boards of a user', async () => {
			const teams = TeamFactory.createMany(1);
			const teamIds = teams.map((team) => team._id);
			const boards = BoardFactory.createMany(4, [
				{ isSubBoard: false, team: null },
				{ team: null },
				{ isSubBoard: false, team: teamIds[0] },
				{ isSubBoard: true, team: teamIds[0] }
			]);
			const userId = faker.datatype.uuid();
			const boardIds = boards.map((board) => board._id);
			const getBoardAndTeamIdsResult = { boardIds, teamIds };
			const filterBoardsResponse = boards.filter(
				(board) => !board.isSubBoard && !board.team && boardIds.includes(board._id)
			);
			const allBoards = { boards: filterBoardsResponse, hasNextPage: false, page: 1 };

			//mock response from getAllBoardIdAndTeamIdsOfUSer
			jest
				.spyOn(boardService, 'getAllBoardIdsAndTeamIdsOfUser')
				.mockResolvedValueOnce(getBoardAndTeamIdsResult);

			//call function getAllBoardIdAndTeamIdsOfUSer
			await boardService.getAllBoardIdsAndTeamIdsOfUser(userId);

			//mock returned values from calls to repo on private function getBoards
			await boardRepositoryMock.getCountPage.mockResolvedValue(1);
			await boardRepositoryMock.getAllBoards.mockResolvedValue(filterBoardsResponse);

			const result = await boardService.getPersonalUserBoards(userId, 1);

			expect(result).toEqual(allBoards);
		});
	});

	describe('getBoard', () => {
		it('should call boardRepository', async () => {
			await boardRepositoryMock.getBoardData(mainBoard._id);

			expect(boardRepositoryMock.getBoardData).toBeCalledTimes(1);
			expect(boardRepositoryMock.getBoardData).toBeCalledWith(mainBoard._id);
		});

		it('should throw error if board is not found ', async () => {
			boardRepositoryMock.getBoardData.mockResolvedValue(null);
			expect(async () => await boardService.getBoard('-1', userDtoMock)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should return board and main board if is a subBoard', async () => {
			const boardResult = await boardService.getBoard(subBoard._id, userDtoMock);

			//format columns to hideVotes that is called on clean board function
			subBoard.columns = hideVotesFromColumns(subBoard.columns, String(userDtoMock._id));

			const response = { board: subBoard, mainBoard };

			expect(boardResult).toEqual(response);
		});

		it('should return board and guestUser if is a guestUser', async () => {
			const board = { ...mainBoard, isPublic: true };
			const userDto = { ...userDtoMock, isSAdmin: false, isAnonymous: true };

			const boardUser = BoardUserFactory.create();
			const tokens: Tokens = {
				accessToken: {
					expiresIn: String(faker.datatype.number()),
					token: faker.lorem.word()
				},
				refreshToken: {
					expiresIn: String(faker.datatype.number()),
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

			const boardResult = await boardService.getBoard(board._id, userDto);

			expect(boardResult).toEqual(boardResponse);
		});

		it('should return a board when boardUserIsFound', async () => {
			const board = { ...mainBoard };
			const userDto = { ...userDtoMock, isSAdmin: false, isAnonymous: true };

			boardRepositoryMock.getBoardData.mockResolvedValue(board);

			//format columns to hideVotes that is called on clean board function
			board.columns = hideVotesFromColumns(board.columns, userDtoMock._id);

			const boardResult = await boardService.getBoard(board._id, userDto);

			expect(boardResult.board).toEqual(board);
		});

		it('should return a board when boardIsPublic, boardUser is not found and userDto is not anonymous', async () => {
			const board = { ...mainBoard, isPublic: true };

			boardRepositoryMock.getBoardData.mockResolvedValue(board);
			getBoardUserServiceMock.getBoardUser.mockResolvedValue(null);

			//format columns to hideVotes that is called on clean board function
			board.columns = hideVotesFromColumns(board.columns, userDtoMock._id);

			const boardResult = await boardService.getBoard(board._id, userDtoMock);

			expect(boardResult.board).toEqual(board);
		});

		it('should throw error when boardIsPublic and creating a board user fails', async () => {
			const board = { ...mainBoard, isPublic: true };

			boardRepositoryMock.getBoardData.mockResolvedValue(board);
			getBoardUserServiceMock.getBoardUser.mockResolvedValueOnce(null);
			getBoardUserServiceMock.getBoardUserPopulated.mockResolvedValueOnce(null);

			expect(async () => await boardService.getBoard(board._id, userDtoMock)).rejects.toThrow(
				BadRequestException
			);
		});
	});

	describe('countBoards', () => {
		it('should call getAllBoardsIdsAndTeamIdsOfUser', async () => {
			jest.spyOn(boardService, 'getAllBoardIdsAndTeamIdsOfUser');

			await boardService.getAllBoardIdsAndTeamIdsOfUser(userId);

			expect(boardService.getAllBoardIdsAndTeamIdsOfUser).toBeCalledTimes(1);
			expect(boardService.getAllBoardIdsAndTeamIdsOfUser).toBeCalledWith(userId);
		});

		it('should call boardRepository', async () => {
			jest
				.spyOn(boardService, 'getAllBoardIdsAndTeamIdsOfUser')
				.mockResolvedValueOnce(getBoardAndTeamIdsResult);

			await boardService.getAllBoardIdsAndTeamIdsOfUser(userId);

			await boardRepositoryMock.countBoards(boardIds, teamIds);

			expect(boardRepositoryMock.countBoards).toBeCalledTimes(1);
			expect(boardRepositoryMock.countBoards).toBeCalledWith(boardIds, teamIds);
		});

		it('should return count of boards', async () => {
			boards[0].isSubBoard = false;
			boards[1].isSubBoard = false;
			boards[2].isSubBoard = false;
			boards[2].team = teamIds[0];

			const boardIds = boards.map((board) => board._id);
			const getBoardAndTeamIdsResult = { boardIds, teamIds };

			jest
				.spyOn(boardService, 'getAllBoardIdsAndTeamIdsOfUser')
				.mockResolvedValueOnce(getBoardAndTeamIdsResult);

			await boardService.getAllBoardIdsAndTeamIdsOfUser(userId);

			const countResult = boards.filter(
				(board) =>
					!board.isSubBoard &&
					(boardIds.includes(board._id) || teamIds.includes(String(board.team)))
			).length;

			boardRepositoryMock.countBoards.mockResolvedValue(countResult);

			const result = await boardService.countBoards(userId);

			expect(result).toEqual(countResult);
		});
	});

	describe('isBoardPublic', () => {
		it('should return the isPublic status of a board', async () => {
			mainBoard.isPublic = true;

			boardRepositoryMock.isBoardPublic.mockResolvedValue(mainBoard);

			const result = await boardService.isBoardPublic(mainBoard._id);

			expect(boardRepositoryMock.isBoardPublic).toBeCalledTimes(1);
			expect(result).toEqual(true);
		});

		it('should throw an error if board is not found', async () => {
			boardRepositoryMock.isBoardPublic.mockResolvedValue(null);

			expect(async () => await boardService.isBoardPublic(mainBoard._id)).rejects.toThrow(
				NotFoundException
			);
		});
	});
});
