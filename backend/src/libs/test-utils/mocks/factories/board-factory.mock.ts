import { faker } from '@faker-js/faker';
import { ColumnFactory } from './column-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import { buildTestFactory } from './generic-factory.mock';

const mockBoardData = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		title: faker.lorem.words(),
		columns: ColumnFactory.createMany(3),
		isPublic: faker.datatype.boolean(),
		maxVotes: faker.number.int({ min: 0, max: 6 }),
		maxUsers: 0,
		maxTeams: '1',
		hideCards: faker.datatype.boolean(),
		hideVotes: faker.datatype.boolean(),
		dividedBoards: [],
		team: '1',
		socketId: faker.string.uuid(),
		users: [],
		recurrent: faker.datatype.boolean(),
		isSubBoard: faker.datatype.boolean(),
		boardNumber: 0,
		slackEnable: faker.datatype.boolean(),
		addCards: faker.datatype.boolean(),
		responsibles: ['1'],
		createdBy: faker.string.uuid(),
		addcards: faker.datatype.boolean(),
		postAnonymously: faker.datatype.boolean(),
		createdAt: faker.date.anytime().toISOString()
	};
};

export const BoardFactory = buildTestFactory<Board>(() => {
	return mockBoardData();
});
