import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, LeanDocument } from 'mongoose';
import { BoardRoles } from '../../../libs/enum/board.roles';
import isEmpty from '../../../libs/utils/isEmpty';
import { GetTeamServiceInterface } from '../../teams/interfaces/services/get.team.service.interface';
import { TYPES } from '../../teams/interfaces/types';
import BoardDto from '../dto/board.dto';
import BoardUserDto from '../dto/board.user.dto';
import {
  Configs,
  CreateBoardService,
} from '../interfaces/services/create.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';
import User, { UserDocument } from '../../users/schemas/user.schema';
import * as stakeHolders from '../../../libs/utils/ignored_users.json';
import TeamDto from '../../teams/dto/team.dto';
import * as SchedulesType from '../../schedules/interfaces/types';
import TeamUser, {
  TeamUserDocument,
} from '../../teams/schemas/team.user.schema';
import { getNextMonth, getDay } from '../../../libs/utils/dates';
import { CreateSchedulesServiceInterface } from '../../schedules/interfaces/services/create.schedules.service';
import { AddCronJobDto } from '../../schedules/dto/add.cronjob.dto';

export interface CreateBoardDto {
  maxUsers: number;
  board: BoardDto;
  team: TeamDto | null;
  users: BoardUserDto[];
}

@Injectable()
export default class CreateBoardServiceImpl implements CreateBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(BoardUser.name)
    private boardUserModel: Model<BoardUserDocument>,
    @Inject(TYPES.services.GetTeamService)
    private getTeamService: GetTeamServiceInterface,
    @Inject(SchedulesType.TYPES.services.CreateSchedulesService)
    private createSchedulesService: CreateSchedulesServiceInterface,
  ) {}

  saveBoardUsers(newUsers: BoardUserDto[], newBoardId: string) {
    Promise.all(
      newUsers.map((user) =>
        this.boardUserModel.create({ ...user, board: newBoardId }),
      ),
    );
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
      }),
    );

    return newBoardsIds.flatMap((result) =>
      result.status === 'fulfilled' ? [result.value] : [],
    );
  }

  async createBoard(boardData: BoardDto, userId: string, isSubBoard = false) {
    const { dividedBoards = [] } = boardData;
    return this.boardModel.create({
      ...boardData,
      createdBy: userId,
      dividedBoards: await this.createDividedBoards(dividedBoards, userId),
      isSubBoard,
    });
  }

  addOwner(users: BoardUserDto[], userId: string) {
    return [
      ...users,
      {
        user: userId.toString(),
        role: BoardRoles.OWNER,
        votesCount: 0,
      },
    ];
  }

  async saveBoardUsersFromTeam(
    newUsers: BoardUserDto[],
    users: BoardUserDto[],
    team: string,
  ) {
    const usersIds = users.map((usersFound) => usersFound.user);
    const teamUsers = await this.getTeamService.getUsersOfTeam(team);
    teamUsers.forEach((teamUser) => {
      const user = teamUser.user as UserDocument;
      if (!usersIds.includes(user._id.toString())) {
        newUsers.push({
          user: user._id.toString(),
          role: !stakeHolders.includes(user.email)
            ? BoardRoles.MEMBER
            : BoardRoles.STAKEHOLDER,
          votesCount: 0,
        });
      }
    });
  }

  async create(boardData: BoardDto, userId: string) {
    const {
      users,
      team,
      recurrent,
      maxVotes,
      postAnonymously,
      hideCards,
      hideVotes,
      maxUsers,
    } = boardData;
    const newUsers = this.addOwner(users, userId);

    const newBoard = await this.createBoard(boardData, userId);

    if (!isEmpty(newUsers)) {
      if (team) {
        const usersIds = users.map((usersFound) => usersFound.user);
        const teamUsers = await this.getTeamService.getUsersOfTeam(team);
        teamUsers.forEach((teamUser) => {
          if (
            !usersIds.includes((teamUser.user as UserDocument)._id.toString())
          ) {
            newUsers.push({
              user: (teamUser.user as UserDocument)._id.toString(),
              role: BoardRoles.MEMBER,
              votesCount: 0,
            });
          }
        });
      }
      this.saveBoardUsers(newUsers, newBoard._id);
    }

    if (newBoard && recurrent && team && maxUsers) {
      const dayToRun = getDay();

      const addCronJobDto: AddCronJobDto = {
        boardId: newBoard._id,
        ownerId: userId,
        teamId: team,
        configs: {
          maxUsers: Number(maxUsers),
          recurrent,
          maxVotes,
          hideCards,
          hideVotes,
          anonymously: postAnonymously,
        },
      };

      this.createSchedulesService.addCronJob(
        dayToRun,
        getNextMonth(),
        addCronJobDto,
      );
    }

    return newBoard;
  }

  getBoardDto(): CreateBoardDto {
    return {
      users: [],
      team: null,
      maxUsers: 2,
      board: {
        title: 'Main Board -',
        columns: [
          { title: 'Went well', color: '$highlight1Light', cards: [] },
          { title: 'To improve', color: '$highlight4Light', cards: [] },
          { title: 'Action points', color: '$highlight3Light', cards: [] },
        ],
        isPublic: false,
        maxVotes: undefined,
        dividedBoards: [],
        recurrent: true,
        users: [],
        team: null,
        isSubBoard: false,
        hideCards: false,
        hideVotes: false,
        postAnonymously: false,
      },
    };
  }

  async splitBoardByTeam(ownerId: string, teamId: string, configs: Configs) {
    const { maxUsers } = configs;

    const teamUsers = await this.getTeamService.getUsersOfTeam(teamId);
    const teamUsersWotStakeholders = teamUsers.filter(
      (teamUser) =>
        !stakeHolders?.includes((teamUser.user as User).email) ?? [],
    );
    const teamUsersWotStakeholdersCount = teamUsersWotStakeholders?.length ?? 0;
    const teamLength = teamUsersWotStakeholdersCount;
    const maxTeams = Math.ceil(teamLength / maxUsers);

    const users = teamUsers.flatMap((teamUser) => {
      if (!stakeHolders?.includes((teamUser.user as User).email)) return [];
      return {
        user: (teamUser.user as UserDocument)._id,
        role: BoardRoles.STAKEHOLDER,
      };
    });

    const boardData: BoardDto = {
      ...this.getBoardDto().board,
      users,
      team: teamId,
      dividedBoards: this.handleSplitBoards(
        maxTeams,
        maxUsers,
        teamUsersWotStakeholders,
      ),
      recurrent: configs.recurrent,
      maxVotes: configs.maxVotes ?? null,
      hideCards: configs.hideCards ?? false,
      hideVotes: configs.hideVotes ?? false,
      postAnonymously: configs.anonymously,
    };

    const board = await this.create(boardData, ownerId);
    if (!board) return null;
    return board;
  }

  getRandomUser = (list: TeamUser[]) =>
    list.splice(Math.floor(Math.random() * list.length), 1)[0];

  handleSplitBoards = (
    maxTeams: number,
    maxUsers: number,
    teamMembers: LeanDocument<TeamUserDocument>[],
  ) => {
    const subBoards: BoardDto[] = [];
    const splitedUsers: BoardUserDto[][] = new Array(maxTeams).fill([]);

    const availableUsers = [...teamMembers];

    new Array(teamMembers.length).fill(0).reduce((j) => {
      if (j >= maxTeams) j = 0;
      const teamUser = this.getRandomUser(availableUsers);
      splitedUsers[j] = [
        ...splitedUsers[j],
        {
          user: (teamUser.user as LeanDocument<UserDocument>)._id.toString(),
          role: BoardRoles.MEMBER,
          votesCount: 0,
        },
      ];
      return ++j;
    }, 0);

    this.generateSubBoards(maxTeams, splitedUsers, subBoards);

    return subBoards;
  };

  generateSubBoards(
    maxTeams: number,
    splitedUsers: BoardUserDto[][],
    subBoards: BoardDto[],
  ) {
    new Array(maxTeams).fill(0).forEach((_, i) => {
      const newBoard = this.generateSubBoard(i + 1);
      splitedUsers[i][Math.floor(Math.random() * splitedUsers[i].length)].role =
        BoardRoles.RESPONSIBLE;
      newBoard.users = splitedUsers[i];
      subBoards.push(newBoard);
    });
  }

  generateSubBoard = (index: number, users: BoardUserDto[] = []): BoardDto => {
    return {
      title: `Sub-team board ${index}`,
      columns: [
        { title: 'Went well', color: '$highlight1Light', cards: [] },
        { title: 'To improve', color: '$highlight4Light', cards: [] },
        { title: 'Action points', color: '$highlight3Light', cards: [] },
      ],
      isPublic: false,
      dividedBoards: [],
      recurrent: false,
      users,
      team: null,
      isSubBoard: true,
      maxVotes: undefined,
      hideCards: false,
      hideVotes: false,
      postAnonymously: false,
    };
  };
}
