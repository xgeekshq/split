import { faker } from '@faker-js/faker';
import { UserDto } from 'src/modules/communication/dto/user.dto';
import { buildTestFactory } from '../generic-factory.mock';

const mockUserCommunicationDto = () => {
	return {
		id: faker.string.uuid(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email(),
		responsible: faker.datatype.boolean(),
		boardId: faker.string.uuid(),
		slackId: faker.string.uuid()
	};
};

export const UserCommunicationDtoFactory = buildTestFactory<UserDto>(() => {
	return mockUserCommunicationDto();
});
