import faker from '@faker-js/faker';
import { ColumnFactory } from './column-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';

const userId = faker.datatype.uuid();

const mockBoardData = (countColumns = 2, countCards = 1, params?: Partial<Board>) => {
	return {
		_id: faker.datatype.uuid(),
		title: faker.lorem.words(),
		columns: ColumnFactory.createMany(countColumns, countCards),
		isPublic: faker.datatype.boolean(),
		maxVotes: String(faker.datatype.number({ min: 0, max: 6 })),
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
		createdBy: userId,
		...params
	};
};

export const BoardFactory = {
	create: (countColumns = 1, countCards = 1, params?: Partial<Board>) =>
		mockBoardData(countColumns, countCards, params),
	createMany: (count = 1, countColumns = 2, countCards = 1, params?: Partial<Board>) =>
		Array.from({ length: count }).map(() => BoardFactory.create(countColumns, countCards, params))
};
