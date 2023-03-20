import faker from '@faker-js/faker';
import { buildTestFactory } from '../generic-factory.mock';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { UserRoleType } from 'src/modules/communication/dto/types';

const mockBoardData = () => {
	return {
		id: faker.database.mongodbObjectId(),
		role: faker.helpers.arrayElement([BoardRoles.MEMBER, BoardRoles.RESPONSIBLE]),
		user: {
			id: faker.database.mongodbObjectId(),
			firstName: faker.lorem.word(),
			lastName: faker.lorem.word()
		}
	};
};

export const UserRoleTypeFactory = buildTestFactory<UserRoleType>(() => {
	return mockBoardData();
});
