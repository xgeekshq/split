import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { User } from '../user/user';

export interface BoardUser {
  id?: any;
  user: User;
  role: BoardUserRoles;
  _id?: string;
  votesCount: number;
}

export interface CreatedBoardUser {
  id: any;
  user: string;
  role: BoardUserRoles;
  _id: string;
  votesCount: number;
}

export interface BoardUserNoPopulated {
  _id: string;
  board: string;
  role: string;
  user: string;
}

export interface BoardUserToAdd {
  user: User;
  role: BoardUserRoles;
  votesCount: number;
  board?: string;
  isNewJoiner?: boolean;
  _id?: string;
}

export interface BoardUserDto {
  user: string;
  role: BoardUserRoles;
}

export interface BoardUserAddAndRemove {
  addBoardUsers: BoardUserToAdd[];
  removeBoardUsers: string[];
  boardId: string;
}
