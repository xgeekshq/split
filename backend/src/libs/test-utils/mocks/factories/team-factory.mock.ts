import faker from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import Team from 'src/modules/teams/entities/teams.schema';

const mockTeamData = () => {
	return {
		_id: faker.datatype.uuid(),
		name: faker.lorem.words(),
		createdAt: faker.datatype.datetime().toISOString()
	};
};

export const TeamFactory = buildTestFactory<Team>(() => {
	return mockTeamData();
});
