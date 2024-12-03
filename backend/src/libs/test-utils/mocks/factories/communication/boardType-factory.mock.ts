import { faker } from '@faker-js/faker';
import { buildTestFactory } from '../generic-factory.mock';
import { BoardType } from 'src/modules/communication/dto/types';
import { UserRoleTypeFactory } from './UserRoleType-factory.mock';

const mockBoardData = () => {
	return {
		id: faker.database.mongodbObjectId(),
		title: faker.lorem.words(),
		isSubBoard: faker.datatype.boolean(),
		dividedBoards: [],
		team: {
			name: faker.lorem.words(),
			users: UserRoleTypeFactory.createMany(3)
		},
		users: UserRoleTypeFactory.createMany(3),
		slackChannelId: faker.lorem.word(),
		boardNumber: Number(faker.number.int())
	};
};

export const BoardTypeFactory = buildTestFactory<BoardType>(() => {
	return mockBoardData();
});
