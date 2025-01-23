import { faker } from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import { AzureUserSyncDTO } from 'src/modules/azure/dto/azure-user.dto';

const mockUserData = (): AzureUserSyncDTO => {
	//xGeeks AD style, the '.' is mandatory for some tests
	const firstName = `${faker.person.firstName()} ${faker.person.middleName()}`;
	const lastName = `${faker.person.middleName()} ${faker.person.lastName()}`;
	const mail = `${firstName[0].toLowerCase()}.${lastName.split(' ').at(-1).toLowerCase()}@xgeeks.com`;

	return {
		id: faker.string.uuid(),
		displayName: firstName.split(' ')[0] + ' ' + lastName.split(' ').at(-1),
		mail: mail,
		userPrincipalName: mail,
		createdDateTime: faker.date.past({ years: 5 }),
		accountEnabled: faker.datatype.boolean(),
		deletedDateTime: faker.datatype.boolean() ? faker.date.recent({ days: 1 }) : null,
		employeeLeaveDateTime: faker.datatype.boolean() ? faker.date.recent({ days: 1 }) : null,
		givenName: firstName,
		surName: lastName
	};
};

export const AzureUserFactory = buildTestFactory<AzureUserSyncDTO>(() => {
	return mockUserData();
});
