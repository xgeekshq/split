import faker from '@faker-js/faker';
import Column from 'src/modules/columns/entities/column.schema';
import { CardFactory } from './card-factory.mock';
import { CardItemFactory } from './cardItem-factory.mock';
import { CommentFactory } from './comment-factory.mock';
import { buildTestFactory } from './generic-factory.mock';
import { UserFactory } from './user-factory';

const cardText = faker.lorem.words();
const cardUsers = UserFactory.createMany(2);

const mockColumnData = (): Column => {
	return {
		_id: faker.datatype.uuid(),
		title: faker.lorem.words(),
		color: '#aaaaaa',
		cards: CardFactory.createMany(2, [
			{
				createdBy: cardUsers[0],
				comments: CommentFactory.createMany(2, [
					{ createdBy: cardUsers[0] },
					{ createdBy: cardUsers[1] }
				]),
				items: [
					CardItemFactory.create({
						createdBy: cardUsers[0],
						comments: CommentFactory.createMany(2, [
							{ createdBy: cardUsers[0] },
							{ createdBy: cardUsers[1] }
						]),
						votes: [cardUsers[0]._id, cardUsers[0]._id, cardUsers[1]._id]
					})
				]
			},
			{
				createdBy: cardUsers[1],
				comments: CommentFactory.createMany(2, [
					{ createdBy: cardUsers[0] },
					{ createdBy: cardUsers[1] }
				]),
				items: [
					CardItemFactory.create({
						createdBy: cardUsers[0],
						comments: CommentFactory.createMany(2, [
							{ createdBy: cardUsers[0] },
							{ createdBy: cardUsers[1] }
						]),
						votes: [cardUsers[0]._id, cardUsers[0]._id, cardUsers[1]._id]
					})
				]
			}
		]),
		cardText: cardText,
		isDefaultText: faker.datatype.boolean()
	};
};

export const ColumnFactory = buildTestFactory<Column>(() => {
	return mockColumnData();
});
