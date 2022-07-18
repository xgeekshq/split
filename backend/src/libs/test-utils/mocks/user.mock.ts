import { faker } from '@faker-js/faker';

const mockedUser = {
	_id: faker.datatype.uuid(),
	email: faker.internet.email(),
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	password: faker.internet.password()
};

export default mockedUser;
