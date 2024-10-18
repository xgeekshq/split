import { faker } from '@faker-js/faker';

const mockedUser = {
	_id: faker.string.uuid(),
	email: faker.internet.email(),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	password: faker.internet.password()
};

export default mockedUser;
