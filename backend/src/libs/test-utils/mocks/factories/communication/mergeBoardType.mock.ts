import { faker } from '@faker-js/faker';

const mockedMergeBoardType = {
	teamNumber: Number(faker.random.numeric()),
	responsiblesChannelId: faker.random.alphaNumeric(6),
	isLastSubBoard: faker.datatype.boolean(),
	boardId: faker.random.alphaNumeric(6),
	mainBoardId: faker.random.alphaNumeric(6)
};

export default mockedMergeBoardType;
