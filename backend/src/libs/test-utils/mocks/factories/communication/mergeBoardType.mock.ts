import { faker } from '@faker-js/faker';

const mockedMergeBoardType = {
	teamNumber: faker.number.int(),
	responsiblesChannelId: faker.string.alphanumeric(6),
	isLastSubBoard: faker.datatype.boolean(),
	boardId: faker.string.alphanumeric(6),
	mainBoardId: faker.string.alphanumeric(6)
};

export default mockedMergeBoardType;
