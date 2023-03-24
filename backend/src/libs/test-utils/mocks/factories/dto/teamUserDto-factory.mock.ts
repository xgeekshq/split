import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import faker from '@faker-js/faker';
import { buildTestFactory } from '../generic-factory.mock';
import { TeamRoles } from 'src/libs/enum/team.roles';

const mockTeamUserDto = () => {
	return {
		user: faker.datatype.uuid(),
		role: faker.helpers.arrayElement([TeamRoles.MEMBER, TeamRoles.ADMIN, TeamRoles.STAKEHOLDER]),
		isNewJoiner: faker.datatype.boolean(),
		canBeResponsible: faker.datatype.boolean()
	};
};

export const TeamUserDtoFactory = buildTestFactory<TeamUserDto>(() => {
	return mockTeamUserDto();
});
