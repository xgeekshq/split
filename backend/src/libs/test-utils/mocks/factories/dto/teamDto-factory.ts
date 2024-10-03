import { faker } from '@faker-js/faker';
import { ForTeamDtoEnum, TeamDto } from 'src/modules/communication/dto/team.dto';
import { BoardRoles } from 'src/modules/communication/dto/types';
import { buildTestFactory } from '../generic-factory.mock';
import { UserCommunicationDtoFactory } from './userCommunicationDto-factory.mock';

const mockTeamCommunicationDto = () => {
	return {
		name: faker.company.name(),
		normalName: faker.company.name(),
		boardId: faker.string.uuid(),
		channelId: faker.string.uuid(),
		type: faker.helpers.arrayElement([ForTeamDtoEnum.SUBTEAM, ForTeamDtoEnum.TEAM]),
		for: faker.helpers.arrayElement([BoardRoles.MEMBER, BoardRoles.RESPONSIBLE]),
		participants: UserCommunicationDtoFactory.createMany(2),
		teamNumber: Math.random() * 10
	};
};

export const TeamCommunicationDtoFactory = buildTestFactory<TeamDto>(() => {
	return mockTeamCommunicationDto();
});
