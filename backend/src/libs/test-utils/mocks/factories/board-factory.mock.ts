import faker from '@faker-js/faker';
import Board from 'src/modules/boards/entities/board.schema';

const boardFactory = (data?: Partial<Board>) => {
	return {
		_id: faker.datatype.uuid(),
		title: faker.lorem.words(),
		columns: [
			{
				_id: faker.datatype.uuid(),
				title: 'columnTitle',
				color: '#aaaaaa',
				cards: [
					{
						_id: '2',
						text: 'text1',
						createdBy: '1',
						comments: [
							{
								text: 'comment1',
								createdBy: '1'
							}
						],
						votes: ['1'],
						anonymous: false,
						items: [
							{
								_id: '2',
								text: 'text1',
								createdBy: '1',
								comments: [
									{
										text: 'comment1',
										createdBy: '1'
									}
								],
								votes: ['1'],
								anonymous: false
							}
						]
					}
				],
				cardText: 'cardText2',
				isDefaultText: true
			},
			{
				_id: faker.datatype.uuid(),
				title: 'columnTitle',
				color: '#aaaaaa',
				cards: [
					{
						_id: '3',
						text: 'text1',
						createdBy: '1',
						comments: [
							{
								text: 'comment1',
								createdBy: '1'
							}
						],
						votes: ['1'],
						anonymous: false,
						items: [
							{
								_id: '3',
								text: 'text1',
								createdBy: '1',
								comments: [
									{
										text: 'comment1',
										createdBy: '1'
									}
								],
								votes: ['1'],
								anonymous: false
							}
						]
					}
				],
				cardText: 'cardText2',
				isDefaultText: true
			}
		],
		isPublic: faker.datatype.boolean(),
		maxVotes: String(faker.datatype.number({ min: 0, max: 6 })),
		maxUsers: 0,
		maxTeams: '1',
		hideCards: faker.datatype.boolean(),
		hideVotes: faker.datatype.boolean(),
		dividedBoards: [],
		team: '1',
		socketId: faker.datatype.uuid(),
		users: [
			{
				_id: '1',
				role: 'admin',
				user: '1',
				votesCount: 0,
				isNewJoiner: faker.datatype.boolean()
			}
		],
		recurrent: faker.datatype.boolean(),
		isSubBoard: faker.datatype.boolean(),
		boardNumber: 0,
		slackEnable: faker.datatype.boolean(),
		addCards: faker.datatype.boolean(),
		responsibles: ['1'],
		...data
	};
};

export const BoardFactoryMock = {
	create: (data?: Partial<Board>) => {
		return boardFactory(data);
	},
	createMany: (count = 1, data?: Partial<Board>[]) => {
		return new Array(count).fill(1).map((_, index) => boardFactory(data ? data[index] : undefined));
	}
};
