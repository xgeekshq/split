import { faker } from '@faker-js/faker';
import CardItem from 'src/modules/cards/entities/card.item.schema';
import { CommentFactory } from './comment-factory.mock';
import { buildTestFactory } from './generic-factory.mock';
import { UserFactory } from './user-factory';

const cardId = faker.string.uuid();
const cardText = faker.lorem.words(5);
const teamId = faker.string.uuid();
const createdAtDate = faker.date.anytime();
const user = UserFactory.create({ joinedAt: new Date(faker.date.anytime()) });

const mockCardItemData = () => {
	return {
		_id: cardId,
		text: cardText,
		createdBy: user,
		createdByTeam: teamId,
		createdAt: createdAtDate,
		comments: CommentFactory.createMany(2, () => ({ createdBy: user })),
		votes: [],
		anonymous: faker.datatype.boolean()
	};
};

export const CardItemFactory = buildTestFactory<CardItem>(() => {
	return mockCardItemData();
});
