import { BoardUserRoles } from "../../utils/enums/board.user.roles";
import { User } from "../user/user";

export interface BoardUser {
  user: User;
  role: BoardUserRoles;
  _id: string;
  votesCount: number;
}
