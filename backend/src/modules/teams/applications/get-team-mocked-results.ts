import { User } from '@slack/web-api/dist/response/AdminAppsRequestsListResponse';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { TeamFactory } from 'src/libs/test-utils/mocks/factories/team-factory.mock';
import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import Team from '../entities/team.schema';

const teams: Team[] = TeamFactory.createMany(4);

export const teamUsers: TeamUser[] = TeamUserFactory.createMany(5);
const users: User[] = UserFactory.createMany(5);
const usersWithId = users.map((user, idx) => ({
	_id: teamUsers[idx]._id,
	...user
}));
const teamUsersWithUsers = teamUsers.map((teamUser, idx) => ({
	...teamUser,
	user: usersWithId[idx]
}));
const team1 = {
	...teams[0],
	users: teamUsersWithUsers
} as Team;
const team2 = {
	...teams[1],
	users: teamUsersWithUsers
} as Team;

export const teamsWithUsers: Team[] = [team1, team2];

export const boards = BoardFactory.createMany(5, [
	{ team: team1._id },
	{ team: team1._id },
	{ team: team1._id },
	{ team: team2._id },
	{ team: team2._id }
]);
