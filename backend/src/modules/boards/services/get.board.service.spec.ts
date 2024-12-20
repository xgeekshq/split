import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { UserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/userDto-factory.mock';
import { NotFoundException } from '@nestjs/common';
import { hideVotesFromColumns } from '../utils/hideVotesFromColumns';
import { GET_TEAM_SERVICE } from 'src/modules/teams/constants';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';
import GetBoardService from 'src/modules/boards/services/get.board.service';
import { GET_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

const userId = faker.string.uuid();
const mainBoard = BoardFactory.create({ isSubBoard: false, isPublic: false });
const subBoard = BoardFactory.create({ isSubBoard: true, isPublic: false });
const boardUser = BoardUserFactory.create({ board: subBoard._id });
const userDtoMock = UserDtoFactory.create({ isSAdmin: false, isAnonymous: false });
const boards = BoardFactory.createMany(4);
const teams = TeamFactory.createMany(2);
const teamIds = teams.map((team) => team._id);
const boardIds = boards.map((board) => board._id);
const getBoardAndTeamIdsResult = { boardIds, teamIds };

describe('GetBoardService', () => {
	let boardService: GetBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let getBoardUserServiceMock: DeepMocked<GetBoardUserServiceInterface>;
	let getTeamServiceMock: DeepMocked<GetTeamServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetBoardService,
				{
					provide: GET_TEAM_SERVICE,
					useValue: createMock<GetTeamServiceInterface>()
				},

				{
					provide: GET_BOARD_USER_SERVICE,
					useValue: createMock<GetBoardUserServiceInterface>()
				},
				{
					provide: BOARD_REPOSITORY,
					useValue: createMock<BoardRepositoryInterface>()
				}
			]
		}).compile();

		boardService = module.get(GetBoardService);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
		getBoardUserServiceMock = module.get(GET_BOARD_USER_SERVICE);
		getTeamServiceMock = module.get(GET_TEAM_SERVICE);
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

			//@ts-expect-error: query
			await boardService.getBoards(true, query, 0, 10);

			expect(boardRepositoryMock.getCountPage).toBeCalledTimes(1);
			expect(boardRepositoryMock.getAllBoards).toBeCalledTimes(1);
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

		it('should return the board and the main board if is a subBoard', async () => {
			const boardResult = await boardService.getBoard(subBoard._id, userDtoMock);

			//format columns to hideVotes that is called on clean board function
			subBoard.columns = hideVotesFromColumns(subBoard.columns, String(userDtoMock._id));

			const response = { board: subBoard, mainBoard };

			expect(boardResult).toEqual(response);
		});

		it("should return a board if isn't a subBoard", async () => {
			boardRepositoryMock.getBoardData.mockResolvedValueOnce(mainBoard);
			const boardResult = await boardService.getBoard(mainBoard._id, userDtoMock);

			//format columns to hideVotes that is called on clean board function
			mainBoard.columns = hideVotesFromColumns(mainBoard.columns, String(userDtoMock._id));

			const response = { board: mainBoard };

			expect(boardResult).toEqual(response);
		});

		it('should throw error if mainBoard is not found ', async () => {
			boardRepositoryMock.getMainBoard.mockResolvedValueOnce(null);
			expect(async () => await boardService.getBoard(subBoard._id, userDtoMock)).rejects.toThrow(
				NotFoundException
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
