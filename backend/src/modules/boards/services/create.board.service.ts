import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, ObjectId } from 'mongoose';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { TeamRoles } from 'src/libs/enum/team.roles';
import {
	fillDividedBoardsUsersWithTeamUsers,
	translateBoard
} from 'src/libs/utils/communication-helpers';
import { getDay, getNextMonth } from 'src/libs/utils/dates';
import { generateBoardDtoData, generateSubBoardDtoData } from 'src/libs/utils/generateBoardData';
import isEmpty from 'src/libs/utils/isEmpty';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { AddCronJobDto } from 'src/modules/schedules/dto/add.cronjob.dto';
import { CreateSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/create.schedules.service.interface';
import * as SchedulesType from 'src/modules/schedules/interfaces/types';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { TYPES as TeamType } from 'src/modules/teams/interfaces/types';
import TeamUser, { TeamUserDocument } from 'src/modules/teams/schemas/team.user.schema';
import { UserDocument } from 'src/modules/users/entities/user.schema';
import BoardDto from '../dto/board.dto';
import BoardUserDto from '../dto/board.user.dto';
import { Configs, CreateBoardService } from '../interfaces/services/create.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';
import * as dayjs from 'dayjs';
import { UpdateTeamServiceInterface } from 'src/modules/teams/interfaces/services/update.team.service.interface';

export interface CreateBoardDto {
	maxUsers: number;
	board: BoardDto;
	team: TeamDto | null;
	users: BoardUserDto[];
}

@Injectable()
export default class CreateBoardServiceImpl implements CreateBoardService {
	private logger = new Logger(CreateBoardServiceImpl.name);

	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		@Inject(forwardRef(() => TeamType.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(forwardRef(() => TeamType.services.UpdateTeamService))
		private updateTeamService: UpdateTeamServiceInterface,
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface,
		@Inject(SchedulesType.TYPES.services.CreateSchedulesService)
		private createSchedulesService: CreateSchedulesServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private slackCommunicationService: CommunicationServiceInterface
	) {}

	saveBoardUsers(newUsers: BoardUserDto[], newBoardId: string) {
		Promise.all(newUsers.map((user) => this.boardUserModel.create({ ...user, board: newBoardId })));
	}

	async createDividedBoards(boards: BoardDto[], userId: string) {
		const newBoardsIds = await Promise.allSettled(
			boards.map(async (board) => {
				const { users } = board;
				const { _id } = await this.createBoard(board, userId, true);

				if (!isEmpty(users)) {
					this.saveBoardUsers(users, _id);
				}

				return _id;
			})
		);

		return newBoardsIds.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
	}

	async createBoard(boardData: BoardDto, userId: string, isSubBoard = false) {
		const { dividedBoards = [], team } = boardData;

		/**
		 * Add in each divided board the team id (from main board)
		 */
		const dividedBoardsWithTeam = dividedBoards.map((dividedBoard) => ({ ...dividedBoard, team }));

		return this.boardModel.create({
			...boardData,
			createdBy: userId,
			dividedBoards: await this.createDividedBoards(dividedBoardsWithTeam, userId),
			isSubBoard
		});
	}

	addOwner(users: BoardUserDto[], userId: string) {
		return [
			...users,
			{
				user: userId.toString(),
				role: BoardRoles.OWNER,
				votesCount: 0
			}
		];
	}

	async saveBoardUsersFromTeam(newUsers: BoardUserDto[], team: string) {
		const usersIds: string[] = [];
		const teamUsers = await this.getTeamService.getUsersOfTeam(team);
		teamUsers.forEach((teamUser) => {
			const user = teamUser.user as UserDocument;

			if (!usersIds.includes(user._id.toString())) {
				newUsers.push({
					user: user._id.toString(),
					role: teamUser.role === TeamRoles.ADMIN ? BoardRoles.MEMBER : teamUser.role,
					votesCount: 0
				});
			}
		});
	}

	async create(boardData: BoardDto, userId: string, fromSchedule = false) {
		const { team, recurrent, maxUsers, slackEnable } = boardData;
		const newUsers = [];

		const newBoard = await this.createBoard(boardData, userId);

		if (team) {
			await this.saveBoardUsersFromTeam(newUsers, team);
		}

		this.saveBoardUsers(newUsers, newBoard._id);

		if (newBoard && recurrent && team && maxUsers) {
			const addCronJobDto: AddCronJobDto = {
				boardId: newBoard._id.toString(),
				ownerId: userId,
				teamId: team,
				maxUsersPerTeam: maxUsers
			};

			if (!fromSchedule) {
				this.createFirstCronJob(addCronJobDto);
			}
		}

		this.logger.verbose(`Communication Slack Enable is set to "${boardData.slackEnable}".`);

		if (slackEnable) {
			const result = await this.getBoardService.getBoard(newBoard._id, userId);

			if (result?.board) {
				this.logger.verbose(`Call Slack Communication Service for board id "${newBoard._id}".`);
				const board = fillDividedBoardsUsersWithTeamUsers(translateBoard(result.board));
				this.slackCommunicationService.execute(board);
			} else {
				this.logger.error(
					`Call Slack Communication Service for board id "${newBoard._id}" fails. Board not found.`
				);
			}
		}

		return newBoard;
	}

	createFirstCronJob(addCronJobDto: AddCronJobDto) {
		this.createSchedulesService.addCronJob(getDay(), getNextMonth() - 1, addCronJobDto);
	}

	verifyIfIsNewJoiner = (userAzureCreatedAt: Date | undefined, joinedAt: Date) => {
		const currentDate = dayjs();

		const dateToCompare = userAzureCreatedAt ? dayjs(userAzureCreatedAt) : dayjs(joinedAt);

		const maxDateToBeNewJoiner = dateToCompare.add(2, 'month');

		return currentDate.isBefore(maxDateToBeNewJoiner) || currentDate.isSame(maxDateToBeNewJoiner);
	};

	async splitBoardByTeam(
		ownerId: string,
		teamId: string,
		configs: Configs
	): Promise<string | null> {
		const { maxUsersPerTeam } = configs;

		let teamUsers = await this.getTeamService.getUsersOfTeam(teamId);

		teamUsers = teamUsers.map((teamUser: TeamUser) => {
			const user = teamUser.user as User & { _id: ObjectId };

			if (
				teamUser.isNewJoiner &&
				!this.verifyIfIsNewJoiner(user.userAzureCreatedAt, user.joinedAt)
			) {
				this.updateTeamService.updateTeamUser({
					team: teamId,
					user: `${user._id}`,
					role: teamUser.role,
					isNewJoiner: false
				});

				return {
					...teamUser,
					isNewJoiner: false
				};
			}

			return teamUser;
		});

		const teamUsersWotStakeholders = teamUsers.filter(
			(teamUser) => !(teamUser.role === TeamRoles.STAKEHOLDER) ?? []
		);
		const teamLength = teamUsersWotStakeholders.length;
		const maxTeams = this.findMaxUsersPerTeam(teamLength, maxUsersPerTeam);

		if (maxTeams < 2 || maxUsersPerTeam < 2) {
			return null;
		}

		const boardData: BoardDto = {
			...generateBoardDtoData(
				`xgeeks-mainboard-${configs.date?.getUTCDay()}-${new Intl.DateTimeFormat('en-US', {
					month: 'long'
				}).format(configs.date)}-${configs.date?.getFullYear()}`
			).board,
			users: [],
			team: teamId,
			dividedBoards: this.handleSplitBoards(maxTeams, teamUsersWotStakeholders),
			recurrent: configs.recurrent,
			maxVotes: configs.maxVotes ?? null,
			hideCards: configs.hideCards ?? false,
			hideVotes: configs.hideVotes ?? false,
			maxUsers: configs.maxUsersPerTeam,
			slackEnable: configs.slackEnable
		};

		const board = await this.create(boardData, ownerId, true);

		if (!board) return null;

		return board._id.toString();
	}

	private findMaxUsersPerTeam = (teamLength: number, maxUsersPerTeam: number): number => {
		let maxTeams = 0;
		do {
			maxTeams = teamLength / maxUsersPerTeam;

			if (maxTeams < 2) {
				maxUsersPerTeam -= 1;

				if (maxTeams <= 0 || maxUsersPerTeam <= 1) {
					return 0;
				}
			}
		} while (maxTeams < 2);

		return Math.floor(maxTeams);
	};

	sortUsersListByOldestCreatedDate = (users: TeamUser[]) =>
		users
			.map((user) => ({
				...user,
				userCreated: (user.user as User).userAzureCreatedAt || (user.user as User).joinedAt
			}))
			.sort((a, b) => Number(b.userCreated) - Number(a.userCreated));

	getAvailableUsersToBeResponsible = (availableUsers: TeamUser[]) => {
		const availableUsersListSorted = this.sortUsersListByOldestCreatedDate(availableUsers);

		// returns the user who has the oldest account date
		return availableUsersListSorted.slice(0, 1).map((user) => ({
			...user,
			isNewJoiner: false
		}));
	};

	getRandomGroup = (usersPerTeam: number, availableUsers: TeamUser[]) => {
		const randomGroupOfUsers = [];

		let availableUsersToBeResponsible = availableUsers.filter((user) => !user.isNewJoiner);

		if (availableUsersToBeResponsible.length < 1) {
			availableUsersToBeResponsible = this.getAvailableUsersToBeResponsible(availableUsers);
		}

		// this object ensures that each group has one element that can be responsible
		const candidateToBeTeamResponsible = this.getRandomUser(availableUsersToBeResponsible);
		randomGroupOfUsers.push({
			user: candidateToBeTeamResponsible.user as User,
			role: BoardRoles.MEMBER,
			votesCount: 0,
			isNewJoiner: candidateToBeTeamResponsible.isNewJoiner
		});

		const availableUsersWotResponsible = availableUsers.filter(
			(user) => user._id !== candidateToBeTeamResponsible._id
		);

		let i = 0;

		// adds the rest of the elements of each group
		while (i < usersPerTeam - 1) {
			const teamUser = this.getRandomUser(availableUsersWotResponsible);
			randomGroupOfUsers.push({
				user: teamUser.user,
				role: BoardRoles.MEMBER,
				votesCount: 0,
				isNewJoiner: teamUser.isNewJoiner
			});
			i++;
		}

		return randomGroupOfUsers;
	};

	getRandomUser = (list: TeamUser[]) => list.splice(Math.floor(Math.random() * list.length), 1)[0];

	handleSplitBoards = (maxTeams: number, teamMembers: LeanDocument<TeamUserDocument>[]) => {
		const subBoards: BoardDto[] = [];
		const splitUsers: BoardUserDto[][] = new Array(maxTeams).fill([]);

		let availableUsers = [...teamMembers];
		const usersPerTeam = Math.floor(teamMembers.length / maxTeams);
		let membersWithoutTeam = teamMembers.length;

		new Array(maxTeams).fill(0).forEach((_, i) => {
			let numberOfUsersByGroup = usersPerTeam;
			membersWithoutTeam -= usersPerTeam;

			if (membersWithoutTeam < usersPerTeam) numberOfUsersByGroup += 1;

			const indexToCompare = i - 1 < 0 ? 0 : i - 1;

			availableUsers = availableUsers.filter(
				(user) => !splitUsers[indexToCompare].find((member) => member._id === user._id)
			);

			splitUsers[i] = this.getRandomGroup(numberOfUsersByGroup, availableUsers);
		});

		// const availableUsers = [...teamMembers];

		// new Array(teamMembers.length).fill(0).reduce((j) => {
		// 	if (j >= maxTeams) j = 0;
		// 	const teamUser = this.getRandomUser(availableUsers);
		// 	splitUsers[j] = [
		// 		...splitUsers[j],
		// 		{
		// 			user: (teamUser.user as LeanDocument<UserDocument>)._id.toString(),
		// 			role: BoardRoles.MEMBER,
		// 			votesCount: 0,
		// 			isNewJoiner: teamUser.isNewJoiner
		// 		}
		// 	];

		// 	return ++j;
		// }, 0);

		this.generateSubBoards(maxTeams, splitUsers, subBoards);

		return subBoards;
	};

	generateSubBoards(maxTeams: number, splitUsers: BoardUserDto[][], subBoards: BoardDto[]) {
		new Array(maxTeams).fill(0).forEach((_, i) => {
			const newBoard = generateSubBoardDtoData(i + 1);
			const teamUsersWotIsNewJoiner = splitUsers[i].filter((user) => !user.isNewJoiner);

			teamUsersWotIsNewJoiner[Math.floor(Math.random() * teamUsersWotIsNewJoiner.length)].role =
				BoardRoles.RESPONSIBLE;

			const result = splitUsers[i].map(
				(user) => teamUsersWotIsNewJoiner.find((member) => member._id === user._id) || user
			);

			newBoard.users = result;
			subBoards.push(newBoard);
		});
	}
}
