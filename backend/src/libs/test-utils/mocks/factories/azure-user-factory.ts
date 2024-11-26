import faker from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import { AzureUserDTO } from 'src/modules/azure/dto/azure-user.dto';

const mockUserData = (): AzureUserDTO => {
	const mail = faker.internet.email();

	return {
		id: faker.datatype.uuid(),
		displayName: faker.name.firstName() + faker.name.lastName(),
		mail: mail,
		userPrincipalName: mail,
		createdDateTime: faker.date.past(5),
		accountEnabled: faker.datatype.boolean(),
		deletedDateTime: faker.datatype.boolean() ? faker.date.recent(1) : null,
		employeeLeaveDateTime: faker.datatype.boolean() ? faker.date.recent(1) : null
	};
};

export const AzureUserFactory = buildTestFactory<AzureUserDTO>(() => {
	return mockUserData();
});
