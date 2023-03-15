import faker from '@faker-js/faker';
import { BoardRoles } from 'src/libs/enum/board.roles';
import BoardUserDto from 'src/modules/boards/dto/board.user.dto';
import { buildTestFactory } from '../generic-factory.mock';

const mockBoardUserDto = () => {
	return {
		id: faker.datatype.uuid(),
		role: faker.helpers.arrayElement([BoardRoles.MEMBER, BoardRoles.RESPONSIBLE]),
		user: faker.datatype.uuid(),
		board: faker.datatype.uuid(),
		votesCount: Math.random() * 10,
		isNewJoiner: faker.datatype.boolean()
	};
};

export const BoardUserDtoFactory = buildTestFactory<BoardUserDto>(() => {
	return mockBoardUserDto();
});
