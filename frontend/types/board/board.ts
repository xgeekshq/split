import ColumnType, { CreateColumn } from "../column";
import { Team } from "../team/team";
import { User } from "../user/user";
import { BoardUser } from "./board.user";

export default interface BoardType {
  _id: string;
  title: string;
  creationDate?: string;
  updatedAt: string;
  columns: ColumnType[];
  isPublic: boolean;
  password?: string;
  maxVotes: number;
  dividedBoards: BoardType[];
  recurrent: boolean;
  team: Team;
  users: BoardUser[];
  createdBy: User;
  socketId?: string;
  isSubBoard?: boolean;
}

export interface BoardToAdd extends Omit<BoardType, "_id" | "columns"> {
  columns: CreateColumn[];
}
