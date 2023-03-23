import { Test, TestingModule } from '@nestjs/testing';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateBoardServiceInterface } from '../interfaces/services/create.board.service.interface';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
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
import CreateBoardService from 'src/modules/boards/services/create.board.service';
import Team from 'src/modules/teams/entities/team.schema';
import Board from 'src/modules/boards/entities/board.schema';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import User from 'src/modules/users/entities/user.schema';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { createBoardService } from '../boards.providers';

describe('CreateBoardService', () => {
	let boardService: CreateBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let createBoardUserServiceMock: DeepMocked<CreateBoardUserServiceInterface>;
	let getTeamServiceMock: DeepMocked<GetTeamServiceInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;
	let createSchedulesServiceMock: DeepMocked<CreateSchedulesServiceInterface>;
	let slackCommunicationServiceMock: DeepMocked<CommunicationServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createBoardService,
				{
					provide: Teams.TYPES.services.GetTeamService,
					useValue: createMock<GetTeamServiceInterface>()
				},
				{
					provide: TeamUsers.TYPES.services.GetTeamUserService,
					useValue: createMock<GetTeamUserServiceInterface>()
				},
				{
					provide: TeamUsers.TYPES.services.UpdateTeamUserService,
					useValue: createMock<UpdateTeamUserServiceInterface>()
				},
				{
					provide: Schedules.TYPES.services.CreateSchedulesService,
					useValue: createMock<CreateSchedulesServiceInterface>()
				},
				{
					provide: CommunicationsType.TYPES.services.SlackCommunicationService,
					useValue: createMock<CommunicationServiceInterface>()
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

		boardService = module.get<CreateBoardService>(createBoardService.provide);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		createBoardUserServiceMock = module.get(BoardUsers.TYPES.services.CreateBoardUserService);
		getTeamServiceMock = module.get(Teams.TYPES.services.GetTeamService);
		getTeamUserServiceMock = module.get(TeamUsers.TYPES.services.GetTeamUserService);
		createSchedulesServiceMock = module.get(Schedules.TYPES.services.CreateSchedulesService);
		slackCommunicationServiceMock = module.get(
			CommunicationsType.TYPES.services.SlackCommunicationService
		);
	});

	let team: Team;
	let boardDataWithDividedBoard: BoardDto;
	let userId: string;
	let subBoardsResult: Board[];
	let subBoardUsers: BoardUser[];
	let users: User[];
	let teamUsers: TeamUser[];
	let boardCreated: Board;
	let boardUsers: BoardUser[];

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
		boardCreated = BoardFactory.create({
			isSubBoard: false,
			dividedBoards: subBoardsResult,
			team: team._id
		});
		boardUsers = BoardUserFactory.createMany(4, [
			{ board: boardCreated._id, user: subBoardUsers[0].user },
			{ board: boardCreated._id, user: subBoardUsers[1].user },
			{ board: boardCreated._id, user: subBoardUsers[2].user },
			{ board: boardCreated._id, user: subBoardUsers[3].user }
		]);

		getTeamServiceMock.getTeam.mockResolvedValue(team);
		boardRepositoryMock.create.mockResolvedValue(boardCreated);
		getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(teamUsers);
	});

	const generateTeamXgeeksData = (slackEnable = false) => {
		const teamXgeeks = TeamFactory.create({ name: 'xgeeks' });

		boardDataWithDividedBoard.team = teamXgeeks._id;
		boardDataWithDividedBoard.slackEnable = slackEnable;

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

		//creates the subBoards, subBoard users and split board
		createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
		boardRepositoryMock.create.mockResolvedValue(boardCreated);

		//get team name and get team users
		getTeamServiceMock.getTeam.mockResolvedValue(teamXgeeks);
		getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(teamUsersXgeeks);

		//saves board users of main board
		createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);
	};

	it('should be defined', () => {
		expect(boardService).toBeDefined();
	});

	describe('create', () => {
		it('should throw error if a board with divided boards is not created', async () => {
			const boardUsers = BoardUserFactory.createMany(4);

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
			//creates the subBoards, subBoard users and split board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);

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
			//creates the subBoards, subBoard users and split board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);

			//mock get team result as null
			getTeamServiceMock.getTeam.mockResolvedValue(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should throw error if the team users are not found on saveBoardUsersFromTeam function', async () => {
			//creates the subBoards, subBoard users and split board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);

			//mock value of getting all the users of the team as null
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should throw error if the createBoardUserService.saveBoardUsers fails', async () => {
			//creates the subBoards, subBoard users and split board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);

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
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(boardUsers);

			const createdBoardResult = await boardService.create(boardData, userId);

			/*Should be called when:  
            - creating the users for the main board
            */
			expect(createBoardUserServiceMock.saveBoardUsers).toBeCalledTimes(1);
			expect(createdBoardResult).toEqual(boardCreated);
		});

		it('should call the createSchedulesService.addCronJob function if board is recurrent and teamName is xgeeks', async () => {
			generateTeamXgeeksData();

			await boardService.create(boardDataWithDividedBoard, userId);

			expect(createSchedulesServiceMock.addCronJob).toBeCalledTimes(1);
		});

		it('should call the slackCommunicationService.execute function if board has slack enable and the teamName is xgeeks', async () => {
			generateTeamXgeeksData(true);

			boardRepositoryMock.getBoardPopulated.mockResolvedValueOnce(boardCreated);

			await boardService.create(boardDataWithDividedBoard, userId);

			expect(slackCommunicationServiceMock.execute).toBeCalledTimes(1);
		});

		it('should throw error if one of the commit transactions fails', async () => {
			//creates the subBoards, subBoard users and split board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);

			//saves board users of main board
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);

			boardRepositoryMock.commitTransaction.mockRejectedValue('commit transaction failed');

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});
	});
});
