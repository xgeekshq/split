import faker from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import User from 'src/modules/users/entities/user.schema';

const mockUserData = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		password: faker.internet.password(),
		email: faker.internet.email(),
		joinedAt: faker.date.past(1),
		strategy: faker.lorem.word(),
		isSAdmin: faker.datatype.boolean(),
		isDeleted: faker.datatype.boolean(),
		isAnonymous: faker.datatype.boolean()
	};
};

export const UserFactory = buildTestFactory<User>(() => {
	return mockUserData();
});
