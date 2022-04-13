import { TeamUser } from "./team.user";

export interface Team {
  _id: string;
  name: string;
  users: TeamUser[];
}
