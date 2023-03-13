import faker from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import { TeamRoles } from 'src/libs/enum/team.roles';
import TeamUser from 'src/modules/teams/entities/team.user.schema';

const mockTeamUserData = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		role: faker.helpers.arrayElement([TeamRoles.MEMBER, TeamRoles.ADMIN, TeamRoles.STAKEHOLDER]),
		isNewJoiner: faker.datatype.boolean(),
		user: faker.database.mongodbObjectId(),
		team: faker.database.mongodbObjectId()
	};
};

export const TeamUserFactory = buildTestFactory<TeamUser>(() => {
	return mockTeamUserData();
});
