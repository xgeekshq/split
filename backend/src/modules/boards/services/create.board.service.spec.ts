import { Test, TestingModule } from '@nestjs/testing';
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
import { Configs } from '../dto/configs.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamRoles } from 'src/libs/enum/team.roles';
import { GET_TEAM_SERVICE } from 'src/modules/teams/constants';
import { GET_TEAM_USER_SERVICE, UPDATE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';
import { CREATE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';
import { CREATE_SCHEDULES_SERVICE } from 'src/modules/schedules/constants';
import { SLACK_COMMUNICATION_SERVICE } from 'src/modules/communication/constants';

const userId: string = faker.datatype.uuid();

const team: Team = TeamFactory.create();

const boardDataWithDividedBoard: BoardDto = BoardDtoFactory.create({
	team: team._id,
	isSubBoard: false,
	recurrent: true,
	maxUsers: 2,
	dividedBoards: BoardDtoFactory.createMany(2, [
		{ isSubBoard: true, boardNumber: 1 },
		{ isSubBoard: true, boardNumber: 2 }
	])
});

const subBoardsResult: Board[] = BoardFactory.createMany(2, [
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
const subBoardUsers: BoardUser[] = BoardUserFactory.createMany(8, [
	{ board: subBoardsResult[0]._id },
	{ board: subBoardsResult[0]._id },
	{ board: subBoardsResult[0]._id },
	{ board: subBoardsResult[0]._id },
	{ board: subBoardsResult[1]._id },
	{ board: subBoardsResult[1]._id },
	{ board: subBoardsResult[1]._id },
	{ board: subBoardsResult[1]._id }
]);

const users: User[] = UserFactory.createMany(9, [
	{ _id: subBoardUsers[0].user as string, providerAccountCreatedAt: new Date() },
	{ _id: subBoardUsers[1].user as string, providerAccountCreatedAt: new Date() },
	{ _id: subBoardUsers[2].user as string, providerAccountCreatedAt: new Date() },
	{ _id: subBoardUsers[3].user as string, providerAccountCreatedAt: new Date() },
	{ _id: subBoardUsers[4].user as string, providerAccountCreatedAt: new Date() },
	{ _id: subBoardUsers[5].user as string, providerAccountCreatedAt: new Date() },
	{ _id: subBoardUsers[6].user as string, providerAccountCreatedAt: faker.date.past(1) },
	{ _id: subBoardUsers[7].user as string, providerAccountCreatedAt: new Date() },
	{}
]);

const teamUsers: TeamUser[] = TeamUserFactory.createMany(9, [
	{
		team: team._id,
		user: users[0],
		isNewJoiner: true,
		canBeResponsible: false,
		role: TeamRoles.MEMBER
	},
	{
		team: team._id,
		user: users[1],
		role: TeamRoles.MEMBER,
		isNewJoiner: true,
		canBeResponsible: false
	},
	{
		team: team._id,
		user: users[2],
		role: TeamRoles.MEMBER,
		isNewJoiner: true,
		canBeResponsible: false
	},
	{
		team: team._id,
		user: users[3],
		role: TeamRoles.MEMBER,
		isNewJoiner: true,
		canBeResponsible: false
	},
	{
		team: team._id,
		user: users[4],
		role: TeamRoles.MEMBER,
		isNewJoiner: true,
		canBeResponsible: false
	},
	{
		team: team._id,
		user: users[5],
		role: TeamRoles.MEMBER,
		isNewJoiner: true,
		canBeResponsible: false
	},
	{
		team: team._id,
		user: users[6],
		role: TeamRoles.ADMIN,
		isNewJoiner: true,
		canBeResponsible: false
	},
	{
		team: team._id,
		user: users[7],
		role: TeamRoles.MEMBER,
		isNewJoiner: true,
		canBeResponsible: false
	},
	{
		team: team._id,
		user: users[8],
		role: TeamRoles.STAKEHOLDER,
		isNewJoiner: false,
		canBeResponsible: true
	}
]);

team.users = teamUsers;

const boardCreated: Board = BoardFactory.create({
	isSubBoard: false,
	dividedBoards: subBoardsResult,
	team: team._id
});

const boardUsers: BoardUser[] = BoardUserFactory.createMany(9, [
	{ board: boardCreated._id, user: subBoardUsers[0].user },
	{ board: boardCreated._id, user: subBoardUsers[1].user },
	{ board: boardCreated._id, user: subBoardUsers[2].user },
	{ board: boardCreated._id, user: subBoardUsers[3].user },
	{ board: boardCreated._id, user: subBoardUsers[4].user },
	{ board: boardCreated._id, user: subBoardUsers[5].user },
	{ board: boardCreated._id, user: subBoardUsers[6].user },
	{ board: boardCreated._id, user: subBoardUsers[7].user },
	{ board: boardCreated._id, user: users[8] }
]);

const usersRegularBoard = BoardUserDtoFactory.createMany(4);

const boardDataRegularBoard = BoardDtoFactory.create({
	team: null,
	isSubBoard: false,
	users: usersRegularBoard
});

const configs: Configs = {
	recurrent: faker.datatype.boolean(),
	maxVotes: undefined,
	hideCards: faker.datatype.boolean(),
	hideVotes: faker.datatype.boolean(),
	maxUsersPerTeam: 2,
	slackEnable: faker.datatype.boolean(),
	date: faker.datatype.datetime(),
	postAnonymously: faker.datatype.boolean()
};

describe('CreateBoardService', () => {
	let boardService: CreateBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let createBoardUserServiceMock: DeepMocked<CreateBoardUserServiceInterface>;
	let getTeamServiceMock: DeepMocked<GetTeamServiceInterface>;
	let getTeamUserServiceMock: DeepMocked<GetTeamUserServiceInterface>;
	let updateTeamUserServiceMock: DeepMocked<UpdateTeamUserServiceInterface>;
	let createSchedulesServiceMock: DeepMocked<CreateSchedulesServiceInterface>;
	let slackCommunicationServiceMock: DeepMocked<CommunicationServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateBoardService,
				{
					provide: GET_TEAM_SERVICE,
					useValue: createMock<GetTeamServiceInterface>()
				},
				{
					provide: GET_TEAM_USER_SERVICE,
					useValue: createMock<GetTeamUserServiceInterface>()
				},
				{
					provide: UPDATE_TEAM_USER_SERVICE,
					useValue: createMock<UpdateTeamUserServiceInterface>()
				},
				{
					provide: CREATE_SCHEDULES_SERVICE,
					useValue: createMock<CreateSchedulesServiceInterface>()
				},
				{
					provide: SLACK_COMMUNICATION_SERVICE,
					useValue: createMock<CommunicationServiceInterface>()
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

		boardService = module.get(CreateBoardService);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
		createBoardUserServiceMock = module.get(CREATE_BOARD_USER_SERVICE);
		getTeamServiceMock = module.get(GET_TEAM_SERVICE);
		getTeamUserServiceMock = module.get(GET_TEAM_USER_SERVICE);
		updateTeamUserServiceMock = module.get(UPDATE_TEAM_USER_SERVICE);
		createSchedulesServiceMock = module.get(CREATE_SCHEDULES_SERVICE);
		slackCommunicationServiceMock = module.get(SLACK_COMMUNICATION_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		getTeamServiceMock.getTeam.mockResolvedValue(team);
		boardRepositoryMock.create.mockResolvedValue(boardCreated);
		getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(teamUsers);
		boardRepositoryMock.commitTransaction.mockResolvedValue(null);
	});

	const generateTeamXgeeksData = (slackEnable = false) => {
		const teamXgeeks = TeamFactory.create({ name: 'xgeeks' });

		boardDataWithDividedBoard.team = teamXgeeks._id;
		boardDataWithDividedBoard.slackEnable = slackEnable;

		const xgeeksBoardCreated = BoardFactory.create({
			isSubBoard: false,
			dividedBoards: subBoardsResult,
			team: teamXgeeks._id
		});
		const xgeeksBoardUsers = BoardUserFactory.createMany(9, [
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[0].user },
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[1].user },
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[2].user },
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[3].user },
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[4].user },
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[5].user },
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[6].user },
			{ board: xgeeksBoardCreated._id, user: subBoardUsers[7].user },
			{ board: xgeeksBoardCreated._id, user: users[8] }
		]);
		const teamUsersXgeeks = TeamUserFactory.createMany(9, [
			{ team: teamXgeeks._id, user: users[0] },
			{ team: teamXgeeks._id, user: users[1] },
			{ team: teamXgeeks._id, user: users[2] },
			{ team: teamXgeeks._id, user: users[3] },
			{ team: teamXgeeks._id, user: users[4] },
			{ team: teamXgeeks._id, user: users[5] },
			{ team: teamXgeeks._id, user: users[6] },
			{ team: teamXgeeks._id, user: users[7] },
			{ team: teamXgeeks._id, user: users[8] }
		]);

		teamXgeeks.users = teamUsersXgeeks;

		//mocks the creation of a split board and it's boardUsers  with the xgeeks
		createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
		boardRepositoryMock.create.mockResolvedValue(xgeeksBoardCreated);

		//mocks the team name and the team users
		getTeamServiceMock.getTeam.mockResolvedValue(teamXgeeks);
		getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(teamUsersXgeeks);

		//saves the board users of a main board
		createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(xgeeksBoardUsers);
	};

	it('should be defined', () => {
		expect(boardService).toBeDefined();
	});

	describe('create', () => {
		it("should throw an error if a board with divided boards isn't created", async () => {
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(boardUsers);
			boardRepositoryMock.create.mockResolvedValue(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it("should throw an error if a board without divided boards isn't created", () => {
			boardRepositoryMock.create.mockResolvedValue(null);

			expect(async () => await boardService.create(boardDataRegularBoard, userId)).rejects.toThrow(
				CreateFailedException
			);
		});

		it('should create a board with divided boards', async () => {
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
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

		it("should throw an error if the team isn't found on the getTeamNameAndTeamUsers function", async () => {
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			getTeamServiceMock.getTeam.mockResolvedValue(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it("should throw an error if the team users aren't found on the saveBoardUsersFromTeam function", async () => {
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(subBoardUsers);
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(null);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should throw an error if the createBoardUserService.saveBoardUsers function fails', async () => {
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
			createBoardUserServiceMock.saveBoardUsers.mockRejectedValueOnce(
				'error inserting board users'
			);

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});

		it('should create a board without divided boards', async () => {
			const regularBoardCreated = BoardFactory.create({
				isSubBoard: false,
				team: null
			});
			const regularBoardUsers = BoardUserFactory.createMany(4, [
				{ board: regularBoardCreated._id, user: usersRegularBoard[0].user },
				{ board: regularBoardCreated._id, user: usersRegularBoard[1].user },
				{ board: regularBoardCreated._id, user: usersRegularBoard[2].user },
				{ board: regularBoardCreated._id, user: usersRegularBoard[3].user }
			]);

			boardRepositoryMock.create.mockResolvedValue(regularBoardCreated);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValue(regularBoardUsers);

			const createdBoardResult = await boardService.create(boardDataRegularBoard, userId);

			/*Should be called when:  
            - creating the users for the main board
            */
			expect(createBoardUserServiceMock.saveBoardUsers).toBeCalledTimes(1);
			expect(createdBoardResult).toEqual(regularBoardCreated);
		});

		it('should call the createSchedulesService.addCronJob function if the board is recurrent and the teamName is xgeeks', async () => {
			generateTeamXgeeksData();

			await boardService.create(boardDataWithDividedBoard, userId);

			expect(createSchedulesServiceMock.addCronJob).toBeCalledTimes(1);
		});

		it('should call the slackCommunicationService.execute function if the board has slack enable and the teamName is xgeeks', async () => {
			generateTeamXgeeksData(true);

			boardRepositoryMock.getBoardPopulated.mockResolvedValueOnce(boardCreated);

			await boardService.create(boardDataWithDividedBoard, userId);

			expect(slackCommunicationServiceMock.execute).toBeCalledTimes(1);
		});

		it('should throw an error if one of the commit transactions fails', async () => {
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);
			boardRepositoryMock.commitTransaction.mockRejectedValue('commit transaction failed');

			expect(
				async () => await boardService.create(boardDataWithDividedBoard, userId)
			).rejects.toThrow(CreateFailedException);
		});
	});

	describe('splitBoardByTeam', () => {
		it("should throw an error when the team users aren't found", async () => {
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(null);
			expect(
				async () => await boardService.splitBoardByTeam(userId, team._id, configs, team.name)
			).rejects.toThrow(NotFoundException);
		});

		it('should return the id of the created board', async () => {
			updateTeamUserServiceMock.updateTeamUser.mockResolvedValue(teamUsers[0]);

			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);

			const boardIdResult = await boardService.splitBoardByTeam(
				userId,
				team._id,
				configs,
				team.name
			);

			expect(boardIdResult).toEqual(boardCreated._id);
		});

		it('should throw error when the maxTeams or maxUsersPerTeam are lower than 2 ', async () => {
			const configs_2: Configs = {
				recurrent: faker.datatype.boolean(),
				maxVotes: undefined,
				hideCards: faker.datatype.boolean(),
				hideVotes: faker.datatype.boolean(),
				maxUsersPerTeam: 1,
				slackEnable: faker.datatype.boolean(),
				date: faker.datatype.datetime(),
				postAnonymously: faker.datatype.boolean()
			};
			updateTeamUserServiceMock.updateTeamUser.mockResolvedValue(teamUsers[0]);

			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(boardUsers);

			expect(
				async () => await boardService.splitBoardByTeam(userId, team._id, configs_2, team.name)
			).rejects.toThrow(BadRequestException);
		});

		it('should call the updateTeamUserService.updateTeamUser function', async () => {
			const newTeam = TeamFactory.create();

			const newUsers: User[] = UserFactory.createMany(9, [
				{
					_id: subBoardUsers[0].user as string,
					providerAccountCreatedAt: faker.date.between(
						'2022-02-02T00:00:00.000Z',
						'2022-09-02T00:00:00.000Z'
					)
				},
				{ _id: subBoardUsers[1].user as string, providerAccountCreatedAt: new Date() },
				{ _id: subBoardUsers[2].user as string, providerAccountCreatedAt: new Date() },
				{ _id: subBoardUsers[3].user as string, providerAccountCreatedAt: new Date() },
				{ _id: subBoardUsers[4].user as string, providerAccountCreatedAt: new Date() },
				{ _id: subBoardUsers[5].user as string, providerAccountCreatedAt: new Date() },
				{
					_id: subBoardUsers[6].user as string,
					providerAccountCreatedAt: faker.date.between(
						'2022-02-02T00:00:00.000Z',
						'2022-09-02T00:00:00.000Z'
					)
				},
				{ _id: subBoardUsers[7].user as string, providerAccountCreatedAt: new Date() },
				{}
			]);
			const newTeamUsers: TeamUser[] = TeamUserFactory.createMany(9, [
				{
					team: team._id,
					user: newUsers[0],
					isNewJoiner: true,
					canBeResponsible: false,
					role: TeamRoles.MEMBER
				},
				{
					team: team._id,
					user: newUsers[1],
					role: TeamRoles.MEMBER,
					isNewJoiner: true,
					canBeResponsible: false
				},
				{
					team: team._id,
					user: newUsers[2],
					role: TeamRoles.MEMBER,
					isNewJoiner: true,
					canBeResponsible: false
				},
				{
					team: team._id,
					user: newUsers[3],
					role: TeamRoles.MEMBER,
					isNewJoiner: true,
					canBeResponsible: false
				},
				{
					team: team._id,
					user: newUsers[4],
					role: TeamRoles.MEMBER,
					isNewJoiner: true,
					canBeResponsible: false
				},
				{
					team: team._id,
					user: newUsers[5],
					role: TeamRoles.MEMBER,
					isNewJoiner: true,
					canBeResponsible: false
				},
				{
					team: team._id,
					user: newUsers[6],
					role: TeamRoles.ADMIN,
					isNewJoiner: true,
					canBeResponsible: false
				},
				{
					team: team._id,
					user: newUsers[7],
					role: TeamRoles.MEMBER,
					isNewJoiner: true,
					canBeResponsible: false
				},
				{
					team: team._id,
					user: newUsers[8],
					role: TeamRoles.STAKEHOLDER,
					isNewJoiner: false,
					canBeResponsible: true
				}
			]);
			newTeam.users = newTeamUsers;

			const newBoardCreated: Board = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoardsResult,
				team: team._id
			});

			const newBoardUsers: BoardUser[] = BoardUserFactory.createMany(9, [
				{ board: newBoardCreated._id, user: subBoardUsers[0].user },
				{ board: newBoardCreated._id, user: subBoardUsers[1].user },
				{ board: newBoardCreated._id, user: subBoardUsers[2].user },
				{ board: newBoardCreated._id, user: subBoardUsers[3].user },
				{ board: newBoardCreated._id, user: subBoardUsers[4].user },
				{ board: newBoardCreated._id, user: subBoardUsers[5].user },
				{ board: newBoardCreated._id, user: subBoardUsers[6].user },
				{ board: newBoardCreated._id, user: subBoardUsers[7].user },
				{ board: newBoardCreated._id, user: users[8] }
			]);

			getTeamServiceMock.getTeam.mockResolvedValue(newTeam);
			updateTeamUserServiceMock.updateTeamUser.mockResolvedValue(newTeamUsers[0]);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(subBoardUsers);
			createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(newBoardUsers);
			getTeamUserServiceMock.getUsersOfTeam.mockResolvedValue(newTeamUsers);
			boardRepositoryMock.create.mockResolvedValue(newBoardCreated);

			await boardService.splitBoardByTeam(userId, newTeam._id, configs, newTeam.name);

			expect(updateTeamUserServiceMock.updateTeamUser).toBeCalled();
		});
	});
});
