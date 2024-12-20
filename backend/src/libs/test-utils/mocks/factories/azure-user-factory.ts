import { faker } from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import { AzureUserDTO } from 'src/modules/azure/dto/azure-user.dto';

const mockUserData = (): AzureUserDTO => {
	//xGeeks AD style, the '.' is mandatory for some tests
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const mail = firstName[0].toLowerCase() + '.' + lastName.toLowerCase() + '@xgeeks.com';

	return {
		id: faker.string.uuid(),
		displayName: firstName + ' ' + lastName,
		mail: mail,
		userPrincipalName: mail,
		createdDateTime: faker.date.past({ years: 5 }),
		accountEnabled: faker.datatype.boolean(),
		deletedDateTime: faker.datatype.boolean() ? faker.date.recent({ days: 1 }) : null,
		employeeLeaveDateTime: faker.datatype.boolean() ? faker.date.recent({ days: 1 }) : null
	};
};

export const AzureUserFactory = buildTestFactory<AzureUserDTO>(() => {
	return mockUserData();
});
