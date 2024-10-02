import { faker } from '@faker-js/faker';
import { BoardRoles } from 'src/libs/enum/board.roles';
import BoardUserDto from 'src/modules/boardUsers/dto/board.user.dto';
import { buildTestFactory } from '../generic-factory.mock';
import { UserFactory } from '../user-factory';

const mockBoardUserDto = () => {
	return {
		id: faker.string.uuid(),
		role: faker.helpers.arrayElement([BoardRoles.MEMBER, BoardRoles.RESPONSIBLE]),
		user: UserFactory.create(),
		board: faker.string.uuid(),
		votesCount: Math.random() * 10,
		isNewJoiner: faker.datatype.boolean()
	};
};

export const BoardUserDtoFactory = buildTestFactory<BoardUserDto>(() => {
	return mockBoardUserDto();
});
