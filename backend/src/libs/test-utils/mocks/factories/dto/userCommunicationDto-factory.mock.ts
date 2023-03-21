import faker from '@faker-js/faker';
import { UserDto } from 'src/modules/communication/dto/user.dto';
import { buildTestFactory } from '../generic-factory.mock';

const mockUserCommunicationDto = () => {
	return {
		id: faker.datatype.uuid(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		responsible: faker.datatype.boolean(),
		boardId: faker.datatype.uuid(),
		slackId: faker.datatype.uuid()
	};
};

export const UserCommunicationDtoFactory = buildTestFactory<UserDto>(() => {
	return mockUserCommunicationDto();
});
