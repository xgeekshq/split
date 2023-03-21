import faker from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { BoardRoles } from 'src/libs/enum/board.roles';

const mockBoardUserData = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		role: faker.helpers.arrayElement([BoardRoles.MEMBER, BoardRoles.RESPONSIBLE]),
		user: faker.database.mongodbObjectId(),
		board: faker.database.mongodbObjectId(),
		votesCount: 0
	};
};

export const BoardUserFactory = buildTestFactory<BoardUser>(() => {
	return mockBoardUserData();
});
