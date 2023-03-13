import faker from '@faker-js/faker';
import UserDto from 'src/modules/users/dto/user.dto';
import { buildTestFactory } from '../generic-factory.mock';

const mockUserDto = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		strategy: faker.lorem.word(),
		isSAdmin: faker.datatype.boolean(),
		isAnonimous: faker.datatype.boolean(),
		providerAccountCreatedAt: faker.date.past(1),
		avatar: faker.internet.avatar()
	};
};

export const UserDtoFactory = buildTestFactory<UserDto>(() => {
	return mockUserDto();
});
