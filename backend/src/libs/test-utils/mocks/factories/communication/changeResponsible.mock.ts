import { faker } from '@faker-js/faker';

const mockedChangeResponsible = {
	newResponsibleEmail: faker.internet.email(),
	previousResponsibleEmail: faker.internet.email(),
	subTeamChannelId: faker.string.alphanumeric(6),
	email: faker.internet.email(),
	teamNumber: Number(faker.string.numeric()),
	responsiblesChannelId: faker.string.alphanumeric(6),
	mainChannelId: faker.string.alphanumeric(6)
};

export default mockedChangeResponsible;
