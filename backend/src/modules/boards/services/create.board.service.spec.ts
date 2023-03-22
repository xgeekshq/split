import { Test, TestingModule } from '@nestjs/testing';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { createBoardService } from './../boards.providers';
import { boardRepository } from '../boards.providers';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { createBoardUserService } from 'src/modules/boardUsers/boardusers.providers';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateBoardServiceInterface } from '../interfaces/services/create.board.service.interface';
import { getTeamService } from 'src/modules/teams/providers';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import {
	getTeamUserService,
	updateTeamUserService
} from 'src/modules/teamUsers/teamusers.providers';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
import { createSchedulesService } from 'src/modules/schedules/schedules.providers';
import { CreateSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/create.schedules.service.interface';
import { BoardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardDto-factory.mock';
import faker from '@faker-js/faker';
import { CreateFailedException } from 'src/libs/exceptions/createFailedBadRequestException';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import BoardDto from '../dto/board.dto';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';

describe('CreateBoardService', () => {
	let boardService: CreateBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let createBoardUserServiceMock: DeepMocked<CreateBoardUserServiceInterface>;
	let getTeamServiceMock: DeepMocked<GetTeamServiceInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;
	let createSchedulesServiceMock: DeepMocked<CreateSchedulesServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createBoardService,
				{
					provide: getTeamService.provide,
					useValue: createMock<GetTeamServiceInterface>()
				},
				{
					provide: getTeamUserService.provide,
					useValue: createMock<GetTeamUserServiceInterface>()
				},
				{
					provide: updateTeamUserService.provide,
					useValue: createMock<UpdateTeamUserServiceInterface>()
				},
				{
					provide: createSchedulesService.provide,
					useValue: createMock<CreateSchedulesServiceInterface>()
				},
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: createMock<CommunicationServiceInterface>()
				},
				{
					provide: boardRepository.provide,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: createBoardUserService.provide,
					useValue: createMock<CreateBoardServiceInterface>()
				}
			]
		}).compile();

		boardService = module.get<CreateBoardServiceInterface>(createBoardService.provide);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		createBoardUserServiceMock = module.get(BoardUsers.TYPES.services.CreateBoardUserService);
		getTeamServiceMock = module.get(Teams.TYPES.services.GetTeamService);
		getTeamUserServiceMock = module.get(TeamUsers.TYPES.services.GetTeamUserService);
		createSchedulesServiceMock = module.get(Schedules.TYPES.services.CreateSchedulesService);
	});

	let team;
	let boardDataWithDividedBoard;
	let userId;
	let subBoardsResult;
	let subBoardUsers;
	let users;
	let teamUsers;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		team = TeamFactory.create();
		boardDataWithDividedBoard = BoardDtoFactory.create({
			team: team._id,
			isSubBoard: false,
			recurrent: true,
			maxUsers: 2,
			dividedBoards: BoardDtoFactory.createMany(2, [
				{ isSubBoard: true, boardNumber: 1 },
				{ isSubBoard: true, boardNumber: 2 }
			])
		});

		userId = faker.datatype.uuid();
		subBoardsResult = BoardFactory.createMany(2, [
			{
				isSubBoard: true,
				boardNumber: 1,
				title: (boardDataWithDividedBoard.dividedBoards[0] as BoardDto).title
			},
			{
				isSubBoard: true,
				boardNumber: 2,
				title: (boardDataWithDividedBoard.dividedBoards[0] as BoardDto).title
			}
		]);
		subBoardUsers = BoardUserFactory.createMany(4, [
			{ board: subBoardsResult[0]._id },
			{ board: subBoardsResult[0]._id },
			{ board: subBoardsResult[1]._id },
			{ board: subBoardsResult[1]._id }
		]);
		users = UserFactory.createMany(4, [
			{ _id: subBoardUsers[0].user as string },
			{ _id: subBoardUsers[1].user as string },
			{ _id: subBoardUsers[2].user as string },
			{ _id: subBoardUsers[3].user as string }
		]);
		teamUsers = TeamUserFactory.createMany(4, [
			{ team: team._id, user: users[0] },
			{ team: team._id, user: users[1] },
			{ team: team._id, user: users[2] },
			{ team: team._id, user: users[3] }
		]);
		team.users = teamUsers;
	});

	it('should be defined', () => {
		expect(boardService).toBeDefined();
	});

	describe('create', () => {
		it('should throw error if a board with divided boards is not created', async () => {
			const boardUsers = BoardUserFactory.createMany(4);
			boardRepositoryMock.insertMany.mockResolvedValueOnce(subBoardsResult);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(boardUsers);
			boardRepositoryMock.create.mockResolvedValue(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should throw error if a board without divided boards is not created', () => {
			boardRepositoryMock.create.mockResolvedValue(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should create a board with divided boards', async () => {
			const boardCreated = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoardsResult,
				team: team._id
			});
			const boardUsers = BoardUserFactory.createMany(4, [
				{ board: boardCreated._id, user: subBoardUsers[0].user },
				{ board: boardCreated._id, user: subBoardUsers[1].user },
				{ board: boardCreated._id, user: subBoardUsers[2].user },
				{ board: boardCreated._id, user: subBoardUsers[3].user }
			]);

			//creates the subBoards, subBoard users and split board
			boardRepositoryMock.insertMany.mockResolvedValueOnce(subBoardsResult);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			boardRepositoryMock.create.mockResolvedValue(boardCreated);

			//get team name and get team users
			getTeamServiceMock.getTeam.mockResolvedValueOnce(team);
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValueOnce(teamUsers);

			//saves board users of main board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);

			const createdBoardResult = await boardService.create(boardDataWithDividedBoard, userId);

			expect(getTeamServiceMock.getTeam).toBeCalledTimes(1);
			expect(getTeamUserServiceMock.getUsersOfTeam).toBeCalledTimes(1);

			/*Should be called when: 
            - creating the users for the subBoards  
            - creating the users for the main board
            */
			expect(createBoardUserServiceMock.saveBoardUsers).toBeCalledTimes(2);
			expect(createdBoardResult).toEqual(boardCreated);
		});

		it('should throw error if the team is not found on getTeamNameAndTeamUsers function', async () => {
			const boardCreated = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoardsResult
			});

			//creates the subBoards, subBoard users and split board
			boardRepositoryMock.insertMany.mockResolvedValueOnce(subBoardsResult);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			boardRepositoryMock.create.mockResolvedValue(boardCreated);

			//mock get team result as null
			getTeamServiceMock.getTeam.mockResolvedValueOnce(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should throw error if the team users are not found on saveBoardUsersFromTeam function', async () => {
			const boardCreated = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoardsResult,
				team: team._id
			});

			//creates the subBoards, subBoard users and split board
			boardRepositoryMock.insertMany.mockResolvedValueOnce(subBoardsResult);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			boardRepositoryMock.create.mockResolvedValue(boardCreated);

			//gets the team
			getTeamServiceMock.getTeam.mockResolvedValueOnce(team);

			//mock value of getting all the users of the team as null
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValueOnce(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should throw error if the createBoardUserService.saveBoardUsers fails', async () => {
			const boardCreated = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoardsResult,
				team: team._id
			});

			//creates the subBoards, subBoard users and split board
			boardRepositoryMock.insertMany.mockResolvedValueOnce(subBoardsResult);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			boardRepositoryMock.create.mockResolvedValue(boardCreated);

			//get team name and get team users
			getTeamServiceMock.getTeam.mockResolvedValueOnce(team);
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValueOnce(teamUsers);

			//saves board users of main board
			createBoardUserServiceMock.saveBoardUsers.mockRejectedValueOnce(
				'error inserting board users'
			);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should create a board without divided boards', async () => {
			const usersDto = BoardUserDtoFactory.createMany(4);
			const boardData = BoardDtoFactory.create({
				team: null,
				isSubBoard: false,
				users: usersDto
			});

			const boardCreated = BoardFactory.create({
				isSubBoard: false,
				team: null
			});
			const boardUsers = BoardUserFactory.createMany(4, [
				{ board: boardCreated._id, user: usersDto[0].user },
				{ board: boardCreated._id, user: usersDto[1].user },
				{ board: boardCreated._id, user: usersDto[2].user },
				{ board: boardCreated._id, user: usersDto[3].user }
			]);

			//creates the subBoards, subBoard users and split board
			boardRepositoryMock.create.mockResolvedValue(boardCreated);

			//saves board users of main board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);

			const createdBoardResult = await boardService.create(boardData, userId);

			/*Should be called when:  
            - creating the users for the main board
            */
			expect(createBoardUserServiceMock.saveBoardUsers).toBeCalledTimes(1);
			expect(createdBoardResult).toEqual(boardCreated);
		});

		it('should call the createSchedulesService.addCronJob function if board is recurrent and teamName is xgeeks', async () => {
			const teamXgeeks = TeamFactory.create({ name: 'xgeeks' });

			boardDataWithDividedBoard.team = teamXgeeks._id;
			boardDataWithDividedBoard.slackEnable = false;

			const boardCreated = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoardsResult,
				team: teamXgeeks._id
			});
			const boardUsers = BoardUserFactory.createMany(4, [
				{ board: boardCreated._id, user: subBoardUsers[0].user },
				{ board: boardCreated._id, user: subBoardUsers[1].user },
				{ board: boardCreated._id, user: subBoardUsers[2].user },
				{ board: boardCreated._id, user: subBoardUsers[3].user }
			]);
			const teamUsersXgeeks = TeamUserFactory.createMany(4, [
				{ team: teamXgeeks._id, user: users[0] },
				{ team: teamXgeeks._id, user: users[1] },
				{ team: teamXgeeks._id, user: users[2] },
				{ team: teamXgeeks._id, user: users[3] }
			]);

			teamXgeeks.users = teamUsersXgeeks;

			// console.log('teamXgeeks', teamXgeeks);

			//creates the subBoards, subBoard users and split board
			boardRepositoryMock.insertMany.mockResolvedValueOnce(subBoardsResult);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			boardRepositoryMock.create.mockResolvedValue(boardCreated);

			//get team name and get team users
			getTeamServiceMock.getTeam.mockResolvedValue(teamXgeeks);
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValueOnce(teamUsersXgeeks);

			//saves board users of main board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);

			await boardService.create(boardDataWithDividedBoard, userId);
			expect(createSchedulesServiceMock.addCronJob).toBeCalledTimes(1);
		});

		it('should throw error if one of the commit transactions fails', async () => {
			// console.log('outro');
			const boardCreated = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoardsResult,
				team: team._id
			});
			const boardUsers = BoardUserFactory.createMany(4, [
				{ board: boardCreated._id, user: subBoardUsers[0].user },
				{ board: boardCreated._id, user: subBoardUsers[1].user },
				{ board: boardCreated._id, user: subBoardUsers[2].user },
				{ board: boardCreated._id, user: subBoardUsers[3].user }
			]);

			//creates the subBoards, subBoard users and split board
			boardRepositoryMock.insertMany.mockResolvedValueOnce(subBoardsResult);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			boardRepositoryMock.create.mockResolvedValue(boardCreated);

			//get team name and get team users
			getTeamServiceMock.getTeam.mockResolvedValueOnce(team);
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValueOnce(teamUsers);

			//saves board users of main board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);

			boardRepositoryMock.commitTransaction.mockRejectedValueOnce('commit transaction failed');

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});
	});
});
