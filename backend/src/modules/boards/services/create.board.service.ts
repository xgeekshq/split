import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';

import { BoardRoles } from 'libs/enum/board.roles';
import { TeamRoles } from 'libs/enum/team.roles';
import {
	fillDividedBoardsUsersWithTeamUsers,
	translateBoard
} from 'libs/utils/communication-helpers';
import { getDay, getNextMonth } from 'libs/utils/dates';
import { generateBoardDtoData, generateSubBoardDtoData } from 'libs/utils/generateBoardData';
import isEmpty from 'libs/utils/isEmpty';
import { GetBoardServiceInterface } from 'modules/boards/interfaces/services/get.board.service.interface';
import { TYPES } from 'modules/boards/interfaces/types';
import { ExecuteCommunicationInterface } from 'modules/communication/interfaces/execute-communication.interface';
import * as CommunicationsType from 'modules/communication/interfaces/types';
import { AddCronJobDto } from 'modules/schedules/dto/add.cronjob.dto';
import { CreateSchedulesServiceInterface } from 'modules/schedules/interfaces/services/create.schedules.service';
import * as SchedulesType from 'modules/schedules/interfaces/types';
import TeamDto from 'modules/teams/dto/team.dto';
import { GetTeamServiceInterface } from 'modules/teams/interfaces/services/get.team.service.interface';
import { TYPES as TeamType } from 'modules/teams/interfaces/types';
import TeamUser, { TeamUserDocument } from 'modules/teams/schemas/team.user.schema';
import { UserDocument } from 'modules/users/schemas/user.schema';

import BoardDto from '../dto/board.dto';
import BoardUserDto from '../dto/board.user.dto';
import { Configs, CreateBoardService } from '../interfaces/services/create.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

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
		@Inject(TeamType.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface,
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface,
		@Inject(SchedulesType.TYPES.services.CreateSchedulesService)
		private createSchedulesService: CreateSchedulesServiceInterface,
		@Inject(CommunicationsType.TYPES.services.ExecuteCommunication)
		private slackCommunicationService: ExecuteCommunicationInterface
	) { }

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
		const usersIds: String[] = [];
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

	async create(boardData: BoardDto, userId: string, fromSchedule: boolean = false) {
		const { team, recurrent, maxVotes, hideCards, hideVotes, maxUsers, slackEnable } = boardData;
		console.log("MAXUSERS", maxUsers)
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
		const dayToRun = getDay();

		this.createSchedulesService.addCronJob(dayToRun, getNextMonth(), addCronJobDto);
	}

	async splitBoardByTeam(ownerId: string, teamId: string, configs: Configs): Promise<string | null> {
		const { maxUsersPerTeam } = configs

		if (maxUsersPerTeam < 2) {
			return null
		}

		const teamUsers = await this.getTeamService.getUsersOfTeam(teamId);
		const teamUsersWotStakeholders = teamUsers.filter(
			(teamUser) => !(teamUser.role === TeamRoles.STAKEHOLDER) ?? []
		);
		const teamUsersWotStakeholdersCount = teamUsersWotStakeholders?.length ?? 0;
		const teamLength = teamUsersWotStakeholdersCount;
		const maxTeams = this.findMaxUsersPerTeam(teamLength, maxUsersPerTeam);

		console.log(maxTeams)
		if (maxTeams < 2) {
			return null
		}

		const boardData: BoardDto = {
			...generateBoardDtoData().board,
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

		console.log(boardData)

		const board = await this.create(boardData, ownerId, true);
		if (!board) return null;
		return board._id.toString();
	}

	findMaxUsersPerTeam = (teamLength: number, maxUsersPerTeam: number): number => {
		let maxTeams = Math.ceil(teamLength / maxUsersPerTeam)
		while ((teamLength / maxUsersPerTeam) < 2 ) {
			maxUsersPerTeam -= 1
			maxTeams = Math.ceil(teamLength / maxUsersPerTeam)
			if (maxTeams <= 0 || maxUsersPerTeam <= 1) {
				return 0
			}
		}
		return Math.ceil(teamLength / maxUsersPerTeam)
	}

	getRandomUser = (list: TeamUser[]) => list.splice(Math.floor(Math.random() * list.length), 1)[0];

	handleSplitBoards = (maxTeams: number, teamMembers: LeanDocument<TeamUserDocument>[]) => {
		const subBoards: BoardDto[] = [];
		const splitUsers: BoardUserDto[][] = new Array(maxTeams).fill([]);

		const availableUsers = [...teamMembers];
		console.log(availableUsers)
		new Array(teamMembers.length).fill(0).reduce((j) => {
			if (j >= maxTeams) j = 0;
			const teamUser = this.getRandomUser(availableUsers);
			splitUsers[j] = [
				...splitUsers[j],
				{
					user: (teamUser.user as LeanDocument<UserDocument>)._id.toString(),
					role: BoardRoles.MEMBER,
					votesCount: 0
				}
			];
			return ++j;
		}, 0);

		this.generateSubBoards(maxTeams, splitUsers, subBoards);

		return subBoards;
	};

	generateSubBoards(maxTeams: number, splitUsers: BoardUserDto[][], subBoards: BoardDto[]) {
		new Array(maxTeams).fill(0).forEach((_, i) => {
			const newBoard = generateSubBoardDtoData(i + 1);
			splitUsers[i][Math.floor(Math.random() * splitUsers[i].length)].role = BoardRoles.RESPONSIBLE;
			newBoard.users = splitUsers[i];
			subBoards.push(newBoard);
		});
	}
}
