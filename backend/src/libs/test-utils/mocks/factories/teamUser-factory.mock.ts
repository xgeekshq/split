import faker from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import { TeamRoles } from 'src/libs/enum/team.roles';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';

const mockTeamUserData = () => {
	const isNewJoiner = faker.datatype.boolean();

	return {
		_id: faker.database.mongodbObjectId(),
		role: faker.helpers.arrayElement([TeamRoles.MEMBER, TeamRoles.ADMIN, TeamRoles.STAKEHOLDER]),
		isNewJoiner,
		canBeResponsible: !isNewJoiner,
		user: faker.database.mongodbObjectId(),
		team: faker.database.mongodbObjectId()
	};
};

export const TeamUserFactory = buildTestFactory<TeamUser>(() => {
	return mockTeamUserData();
});
