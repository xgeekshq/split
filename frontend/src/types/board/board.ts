import { User, GuestUser } from '@/types/user/user';
import ColumnType, { CreateColumn } from '../column';
import { Team } from '../team/team';
import { BoardUser, BoardUserDto, BoardUserToAdd } from './board.user';

export interface GetBoardResponse {
  guestUser: GuestUser;
  board: BoardType;
  mainBoard: {
    _id: string;
    title: string;
  };
}

export default interface BoardType {
  _id: string;
  title: string;
  creationDate?: string;
  updatedAt: string;
  columns: ColumnType[];
  isPublic: boolean;
  password?: string;
  dividedBoards: BoardType[];
  recurrent: boolean;
  team: Team;
  users: BoardUser[];
  createdBy: User;
  socketId?: string;
  isSubBoard?: boolean;
  boardNumber: number;
  maxVotes?: number;
  hideCards: boolean;
  hideVotes: boolean;
  votes?: string;
  submitedByUser?: string;
  submitedAt?: Date;
  slackEnable?: boolean;
  responsibles?: string[];
  addCards: boolean;
  postAnonymously: boolean;
  phase?: string;
}

export interface BoardInfoType {
  board: BoardType;
  mainBoard?: {
    _id: string;
    title: string;
  };
}

export interface BoardToAdd
  extends Omit<
    BoardType,
    '_id' | 'columns' | 'team' | 'createdBy' | 'updatedAt' | 'dividedBoards' | 'users'
  > {
  columns: CreateColumn[];
  team: string | null;
  users: BoardUserToAdd[];
  dividedBoards: BoardToAdd[];
}

export interface CreateBoardDto extends Omit<BoardToAdd, 'dividedBoards' | 'users'> {
  dividedBoards: CreateBoardDto[];
  users: BoardUserDto[];
  maxUsers?: number;
}

export type UpdateBoardType = {
  _id: string;
  hideCards: boolean;
  hideVotes: boolean;
  title: string;
  maxVotes?: number | null;
  users?: BoardUser[];
  isPublic: boolean;
  columns?: (ColumnType | CreateColumn)[];
  addCards: boolean;
  responsible?: BoardUser;
  postAnonymously: boolean;
  team?: string;
  phase?: string;
};

export type UpdateBoardPhaseType = {
  boardId: string;
  phase: string;
};

export type PhaseChangeEventType = {
  boardId: string;
  phase: string;
  hideCards: boolean;
  hideVotes: boolean;
  addCards: boolean;
  columns: ColumnType[];
};
