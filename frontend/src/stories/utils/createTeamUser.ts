import { Team } from '@/types/team/team';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { TeamUserFactory } from '@/utils/factories/user';

export const createTeamUser = (user: any, team: Team) => {
  const foundUser = team.users.findIndex((u) => String(u.user._id) === String(user.id));
  if (foundUser !== -1) return;

  const teamUser = TeamUserFactory.create({
    user: { _id: user.id, ...user },
    role: TeamUserRoles.ADMIN,
  });
  team.users.push(teamUser);
};
