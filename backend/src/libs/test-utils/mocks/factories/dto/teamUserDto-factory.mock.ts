import { TeamRoles } from 'src/libs/enum/team.roles';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { faker } from '@faker-js/faker';
import { buildTestFactory } from '../generic-factory.mock';

const mockTeamUserDto = () => {
	return {
		role: faker.helpers.arrayElement([TeamRoles.MEMBER, TeamRoles.ADMIN, TeamRoles.STAKEHOLDER]),
		team: faker.string.uuid(),
		user: faker.string.uuid(),
		isNewJoiner: faker.datatype.boolean(),
		canBeResponsible: faker.datatype.boolean()
	};
};

export const TeamUserDtoFactory = buildTestFactory<TeamUserDto>(() => {
	return mockTeamUserDto();
});
