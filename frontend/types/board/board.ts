import ColumnType, { CreateColumn } from "../column";
import { User } from "../user";

export default interface BoardType {
  _id: string;
  title: string;
  creationDate?: string;
  columns: ColumnType[];
  createdBy?: User;
  isPublic: boolean;
  password?: string;
  maxVotes: number;
  socketId?: string;
}

export interface BoardToAdd extends Omit<BoardType, "_id" | "columns"> {
  columns: CreateColumn[];
}
