import faker from '@faker-js/faker';
import Column from 'src/modules/columns/entities/column.schema';

// const userId = faker.datatype.uuid();
// const cardId = faker.datatype.uuid();
const cardText = faker.lorem.words();

const mockColumnData = (params: Partial<Column>): Column => {
	return {
		_id: faker.datatype.uuid(),
		title: faker.lorem.words(),
		color: '#aaaaaa',
		cards: [
			// {
			// 	_id: cardId,
			// 	text: cardText,
			// 	createdBy: userId,
			// 	comments: [
			// 		{
			// 			text: commentText,
			// 			createdBy: new ObjectId(userId)
			// 		}
			// 	],
			// 	votes: [],
			// 	anonymous: false,
			// 	items: [
			// 		{
			// 			_id: cardId,
			// 			text: cardText,
			// 			createdBy: userId,
			// 			comments: [
			// 				{
			// 					text: commentText,
			// 					createdBy: new ObjectId(userId)
			// 				}
			// 			],
			// 			votes: [],
			// 			anonymous: false
			// 		}
			// 	]
			// }
		],
		cardText: cardText,
		isDefaultText: faker.datatype.boolean(),
		...params
	};
};

export const ColumnFactory = {
	create: (params: Partial<Column> = {}): Column => mockColumnData(params),
	createMany: (amount: number, params: Partial<Column> = {}): Column[] =>
		Array.from({ length: amount }).map(() => ColumnFactory.create(params))
};
