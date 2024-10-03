import { faker } from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import Team from 'src/modules/teams/entities/team.schema';

const dateCreatedAt = faker.date.past({ years: 1 });

const mockTeamData = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		name: faker.company.name(),
		createdAt: dateCreatedAt,
		updatedAt: faker.date.between({ from: dateCreatedAt, to: Date.now() })
	};
};

export const TeamFactory = buildTestFactory<Team>(() => {
	return mockTeamData();
});
