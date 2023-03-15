import faker from '@faker-js/faker';
import { BoardPhases } from 'src/libs/enum/board.phases';
import BoardDto from 'src/modules/boards/dto/board.dto';
import { buildTestFactory } from '../generic-factory.mock';
import { ColumnDtoFactory } from './columnDto-factory.mock';

const mockBoardDto = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		title: faker.lorem.words(),
		columns: ColumnDtoFactory.createMany(3),
		isPublic: faker.datatype.boolean(),
		maxVotes: faker.datatype.number({ min: 0, max: 6 }),
		maxUsers: 0,
		maxTeams: '1',
		hideCards: faker.datatype.boolean(),
		hideVotes: faker.datatype.boolean(),
		dividedBoards: [],
		team: '1',
		socketId: faker.datatype.uuid(),
		users: [],
		recurrent: faker.datatype.boolean(),
		isSubBoard: faker.datatype.boolean(),
		boardNumber: 0,
		slackEnable: faker.datatype.boolean(),
		addCards: faker.datatype.boolean(),
		responsibles: ['1'],
		createdBy: faker.datatype.uuid(),
		addcards: faker.datatype.boolean(),
		postAnonymously: faker.datatype.boolean(),
		createdAt: faker.datatype.datetime().toISOString(),
		phase: faker.helpers.arrayElement([
			BoardPhases.ADDCARDS,
			BoardPhases.SUBMITTED,
			BoardPhases.VOTINGPHASE
		])
	};
};

export const BoardDtoFactory = buildTestFactory<BoardDto>(() => {
	return mockBoardDto();
});
