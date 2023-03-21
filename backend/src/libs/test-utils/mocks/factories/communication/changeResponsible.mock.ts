import { faker } from '@faker-js/faker';

const mockedChangeResponsible = {
	newResponsibleEmail: faker.internet.email(),
	previousResponsibleEmail: faker.internet.email(),
	subTeamChannelId: faker.random.alphaNumeric(6),
	email: faker.internet.email(),
	teamNumber: Number(faker.random.numeric()),
	responsiblesChannelId: faker.random.alphaNumeric(6),
	mainChannelId: faker.random.alphaNumeric(6)
};

export default mockedChangeResponsible;
