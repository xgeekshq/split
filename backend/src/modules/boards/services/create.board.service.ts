import { UpdateTeamUserServiceInterface } from './../../teamusers/interfaces/services/update.team.user.service.interface';
import { GetTeamUserServiceInterface } from './../../teamusers/interfaces/services/get.team.user.service.interface';
import { CreateBoardUserServiceInterface } from '../../boardusers/interfaces/services/create.board.user.service.interface';
import { LeanDocument } from 'mongoose';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { TeamRoles } from 'src/libs/enum/team.roles';
import {
	fillDividedBoardsUsersWithTeamUsers,
	translateBoard
} from 'src/libs/utils/communication-helpers';
import { getDay, getNextMonth } from 'src/libs/utils/dates';
import { generateBoardDtoData, generateSubBoardDtoData } from 'src/libs/utils/generateBoardData';
import isEmpty from 'src/libs/utils/isEmpty';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { AddCronJobDto } from 'src/modules/schedules/dto/add.cronjob.dto';
import { CreateSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/create.schedules.service.interface';
import * as SchedulesType from 'src/modules/schedules/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardusers/interfaces/types';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { TYPES as TeamType } from 'src/modules/teams/interfaces/types';
import * as TeamUsers from 'src/modules/teamusers/interfaces/types';
import TeamUser, { TeamUserDocument } from 'src/modules/teams/entities/team.user.schema';
import User from 'src/modules/users/entities/user.schema';
import BoardDto from '../dto/board.dto';
import BoardUserDto from '../../boardusers/dto/board.user.dto';
import { CreateBoardServiceInterface } from '../interfaces/services/create.board.service.interface';
import Board from '../entities/board.schema';
import { addDays, addMonths, isAfter } from 'date-fns';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Configs } from '../dto/configs.dto';

@Injectable()
export default class CreateBoardService implements CreateBoardServiceInterface {
	private logger = new Logger(CreateBoardService.name);

	constructor(
		@Inject(forwardRef(() => TeamType.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(TeamUsers.TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamUserServiceInterface,
		@Inject(TeamUsers.TYPES.services.UpdateTeamUserService)
		private updateTeamUserService: UpdateTeamUserServiceInterface,
		@Inject(SchedulesType.TYPES.services.CreateSchedulesService)
		private createSchedulesService: CreateSchedulesServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private slackCommunicationService: CommunicationServiceInterface,
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.CreateBoardUserService)
		private createBoardUserService: CreateBoardUserServiceInterface
	) {}

	async create(boardData: BoardDto, userId: string, fromSchedule = false): Promise<Board> {
		const { team, recurrent, maxUsers, slackEnable, users, dividedBoards } = boardData;

		const haveDividedBoards = dividedBoards.length > 0 ? true : false;
		const newUsers = [];

		const newBoard = await this.createBoard(boardData, userId, false, haveDividedBoards);
		let teamData;

		if (team) {
			await this.saveBoardUsersFromTeam(newUsers, team, boardData.responsibles);
			teamData = await this.getTeamService.getTeam(team);
		}

		if (!haveDividedBoards && !team) {
			users.forEach((user) =>
				newUsers.push({
					...user,
					votesCount: 0
				})
			);
		}

		await this.createBoardUserService.saveBoardUsers(newUsers, newBoard._id);

		if (newBoard && recurrent && team && maxUsers && teamData.name === 'xgeeks') {
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

		if (slackEnable && team && teamData.name === 'xgeeks') {
			const populatedBoard = await this.boardRepository.getBoardPopulated(newBoard._id);

			if (populatedBoard) {
				this.logger.verbose(`Call Slack Communication Service for board id "${newBoard._id}".`);
				const board = fillDividedBoardsUsersWithTeamUsers(translateBoard(populatedBoard));
				this.slackCommunicationService.execute(board);
			} else {
				this.logger.error(
					`Call Slack Communication Service for board id "${newBoard._id}" fails. Board not found.`
				);
			}
		}

		return newBoard;
	}

	async splitBoardByTeam(
		ownerId: string,
		teamId: string,
		configs: Configs
	): Promise<string | null> {
		const { maxUsersPerTeam } = configs;

		let teamUsers = await this.getTeamUserService.getUsersOfTeam(teamId);

		teamUsers = teamUsers.map((teamUser: TeamUser) => {
			const user = teamUser.user as User;

			if (
				teamUser.isNewJoiner &&
				!this.verifyIfIsNewJoiner(user.joinedAt, user.providerAccountCreatedAt)
			) {
				this.updateTeamUserService.updateTeamUser({
					team: teamId,
					user: `${user._id}`,
					role: teamUser.role,
					isNewJoiner: false,
					canBeResponsible: true
				});

				teamUser.isNewJoiner = false;
				teamUser.canBeResponsible = true;
			}

			return teamUser;
		});

		const teamUsersWotStakeholders = teamUsers.filter(
			(teamUser) => teamUser.role !== TeamRoles.STAKEHOLDER 
		);
		const teamLength = teamUsersWotStakeholders.length;
		const rawMaxTeams = teamLength / Number(maxUsersPerTeam);
		const maxTeams = Math.ceil(rawMaxTeams) === 2 ? 2 : Math.floor(rawMaxTeams);

		if (maxTeams < 2 || maxUsersPerTeam < 2) {
			return null;
		}

		const team = await this.getTeamService.getTeam(teamId);
		const responsibles = [];
		const today = new Date();

		const boardData: BoardDto = {
			...generateBoardDtoData(
				`${team.name}-mainboard-${new Intl.DateTimeFormat('en-US', {
					month: 'long'
				}).format(today)}-${configs.date?.getFullYear()}`
			).board,
			users: [],
			team: teamId,
			dividedBoards: this.handleSplitBoards(maxTeams, teamUsersWotStakeholders, responsibles),
			recurrent: configs.recurrent,
			maxVotes: configs.maxVotes ?? null,
			hideCards: true,
			postAnonymously: configs.postAnonymously,
			hideVotes: configs.hideVotes ?? false,
			maxUsers: Math.ceil(configs.maxUsersPerTeam),
			slackEnable: configs.slackEnable,
			responsibles
		};

		const board = await this.create(boardData, ownerId, true);

		if (!board) return null;

		return board._id.toString();
	}

	/* --------------- HELPERS --------------- */

	private async createDividedBoards(boards: BoardDto[], userId: string) {
		const newBoardsIds = await Promise.allSettled(
			boards.map(async (board) => {
				board.addCards = true;
				const { users } = board;
				const { _id } = await this.createBoard(board, userId, true, false);

				if (!isEmpty(users)) {
					await this.createBoardUserService.saveBoardUsers(users, _id);
				}

				return _id;
			})
		);

		return newBoardsIds.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
	}

	private async createBoard(
		boardData: BoardDto,
		userId: string,
		isSubBoard = false,
		haveSubBoards = true
	): Promise<Board> {
		const { dividedBoards = [], team } = boardData;

		if (haveSubBoards) {
			/**
			 * Add in each divided board the team id (from main board)
			 */
			const dividedBoardsWithTeam = dividedBoards.map((dividedBoard) => ({
				...dividedBoard,
				team,
				slackEnable: boardData.slackEnable,
				hideCards: true,
				postAnonymously: true
			}));

			return this.boardRepository.create<BoardDto>({
				...boardData,
				createdBy: userId,
				dividedBoards: await this.createDividedBoards(dividedBoardsWithTeam, userId),
				addCards: false,
				isSubBoard
			});
		}

		return this.boardRepository.create<BoardDto>({
			...boardData,
			dividedBoards: [],
			createdBy: userId,
			isSubBoard
		});
	}

	private async saveBoardUsersFromTeam(
		newUsers: BoardUserDto[],
		team: string,
		responsibles: string[]
	) {
		const usersIds: string[] = [];
		const teamUsers = await this.getTeamUserService.getUsersOfTeam(team);

		teamUsers.forEach((teamUser) => {
			const user = teamUser.user as User;

			if (!usersIds.includes(user._id.toString())) {
				newUsers.push({
					user: user._id.toString(),
					role: responsibles.includes(user._id.toString())
						? BoardRoles.RESPONSIBLE
						: this.handleBoardUserRole(teamUser),
					votesCount: 0
				});
			}
		});
	}

	private handleBoardUserRole(teamUser: TeamUser): string {
		return teamUser.role === TeamRoles.ADMIN || teamUser.role === TeamRoles.STAKEHOLDER
			? BoardRoles.RESPONSIBLE
			: teamUser.role;
	}

	private createFirstCronJob(addCronJobDto: AddCronJobDto) {
		this.createSchedulesService.addCronJob({
			day: getDay(),
			month: getNextMonth() - 1,
			addCronJobDto
		});
	}

	private verifyIfIsNewJoiner = (joinedAt: Date, providerAccountCreatedAt?: Date) => {
		let dateToCompare = new Date(providerAccountCreatedAt || joinedAt);

		dateToCompare = addDays(dateToCompare, 15);

		const maxDateToBeNewJoiner = addMonths(dateToCompare, 3);

		return isAfter(maxDateToBeNewJoiner, new Date());
	};

	private sortUsersListByOldestCreatedDate = (users: TeamUser[]) =>
		users
			.map((user) => {
				return {
					...user,
					userCreated: (user.user as User).providerAccountCreatedAt || (user.user as User).joinedAt
				};
			})
			.sort((a, b) => Number(b.userCreated) - Number(a.userCreated));

	private getAvailableUsersToBeResponsible = (availableUsers: TeamUser[]) => {
		const availableUsersListSorted = this.sortUsersListByOldestCreatedDate(availableUsers);

		// returns the user who has the oldest account date
		const selectedAvailableUser = availableUsersListSorted.slice(0, 1);

		const findSelectedAvailableUser = availableUsers.find(
			(user) => (user.user as User)._id === (selectedAvailableUser[0].user as User)._id
		);

		findSelectedAvailableUser.isNewJoiner = false;
		findSelectedAvailableUser.canBeResponsible = true;

		const findSelectedAvailableUserArray: TeamUser[] = [];

		findSelectedAvailableUserArray.push(findSelectedAvailableUser);

		return findSelectedAvailableUserArray;
	};

	private getRandomGroup = (usersPerTeam: number, availableUsers: TeamUser[]) => {
		const randomGroupOfUsers = [];

		let availableUsersToBeResponsible = availableUsers.filter(
			(user) => !user.isNewJoiner && user.canBeResponsible
		);

		if (availableUsersToBeResponsible.length < 1) {
			availableUsersToBeResponsible = this.getAvailableUsersToBeResponsible(availableUsers);
		}

		// this object ensures that each group has one element that can be responsible
		const candidateToBeTeamResponsible = this.getRandomUser(availableUsersToBeResponsible);

		randomGroupOfUsers.push({
			user: (candidateToBeTeamResponsible.user as User)._id,
			role: BoardRoles.MEMBER,
			votesCount: 0,
			isNewJoiner: candidateToBeTeamResponsible.isNewJoiner,
			canBeResponsible: candidateToBeTeamResponsible.canBeResponsible
		});

		const availableUsersWotResponsible = availableUsers.filter(
			(user) => (user.user as User)._id !== (candidateToBeTeamResponsible.user as User)._id
		);

		let i = 0;

		// adds the rest of the elements of each group
		while (i < usersPerTeam - 1) {
			const teamUser = this.getRandomUser(availableUsersWotResponsible);
			randomGroupOfUsers.push({
				user: (teamUser.user as User)._id,
				role: BoardRoles.MEMBER,
				votesCount: 0,
				isNewJoiner: teamUser.isNewJoiner,
				canBeResponsible: teamUser.canBeResponsible
			});
			i++;
		}

		return randomGroupOfUsers;
	};

	private getRandomUser = (list: TeamUser[]) =>
		list.splice(Math.floor(Math.random() * list.length), 1)[0];

	private handleSplitBoards = (
		maxTeams: number,
		teamMembers: LeanDocument<TeamUserDocument>[],
		responsibles: string[]
	) => {
		const subBoards: BoardDto[] = [];
		const splitUsers: BoardUserDto[][] = new Array(maxTeams).fill([]);

		let availableUsers = [...teamMembers];

		const canBeResponsibles = availableUsers.filter(
			(user) => !user.isNewJoiner && user.canBeResponsible
		);
		const responsiblesAvailable: TeamUser[] = [];
		while (canBeResponsibles.length > 0 && responsiblesAvailable.length !== maxTeams) {
			const idx = Math.floor(Math.random() * canBeResponsibles.length);
			const randomUser = canBeResponsibles[idx];

			if (randomUser && !responsiblesAvailable.includes(randomUser)) {
				responsiblesAvailable.push(randomUser);
				canBeResponsibles.splice(idx, 1);
			}
		}

		availableUsers = availableUsers.filter((user) => !responsiblesAvailable.includes(user));

		const usersPerTeam = Math.floor(teamMembers.length / maxTeams);
		let leftOverUsers = teamMembers.length % maxTeams;

		new Array(maxTeams).fill(0).forEach((_, i) => {
			if (responsiblesAvailable.length > 0) {
				const removedUser = responsiblesAvailable.shift();

				if (removedUser) {
					availableUsers.push(removedUser);
				}
			}

			const numberOfUsersByGroup = leftOverUsers-- > 0 ? usersPerTeam + 1 : usersPerTeam;

			splitUsers[i] = this.getRandomGroup(numberOfUsersByGroup, availableUsers);

			availableUsers = availableUsers.filter((user) => {
				return !splitUsers[i].some((member) => {
					return member.user === (user.user as User)._id;
				});
			});
		});

		this.generateSubBoards(maxTeams, splitUsers, subBoards, responsibles);

		return subBoards;
	};

	private generateSubBoards(
		maxTeams: number,
		splitUsers: BoardUserDto[][],
		subBoards: BoardDto[],
		responsibles: string[]
	) {
		new Array(maxTeams).fill(0).forEach((_, i) => {
			const newBoard = generateSubBoardDtoData(i + 1);
			const canBeResponsibles = splitUsers[i].filter(
				(user) => !user.isNewJoiner && user.canBeResponsible
			);

			const randomIndex = Math.floor(Math.random() * canBeResponsibles.length);
			canBeResponsibles[randomIndex].role = BoardRoles.RESPONSIBLE;
			responsibles.push(canBeResponsibles[randomIndex].user.toString());

			const result = splitUsers[i].map(
				(user) => canBeResponsibles.find((member) => member.user === user.user) || user
			);

			newBoard.users = result;
			subBoards.push(newBoard);
		});
	}
}
