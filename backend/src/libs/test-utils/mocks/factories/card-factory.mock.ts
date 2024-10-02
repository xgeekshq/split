import { faker } from '@faker-js/faker';
import Card from 'src/modules/cards/entities/card.schema';
import { CardItemFactory } from './cardItem-factory.mock';
import { CommentFactory } from './comment-factory.mock';
import { buildTestFactory } from './generic-factory.mock';
import { UserFactory } from './user-factory';

const cardId = faker.string.uuid();
const cardText = faker.lorem.words(5);
const teamId = faker.string.uuid();
const createdAtDate = faker.date.anytime();
const user = UserFactory.create({ joinedAt: new Date(faker.date.anytime()) });

const mockCardData = (): Card => {
	return {
		_id: cardId,
		text: cardText,
		createdBy: user,
		createdByTeam: teamId,
		createdAt: createdAtDate,
		comments: CommentFactory.createMany(2, () => ({ createdBy: user })),
		votes: [],
		anonymous: faker.datatype.boolean(),
		items: [
			CardItemFactory.create({
				createdBy: user,
				comments: CommentFactory.createMany(2, () => ({ createdBy: user }))
			})
		]
	};
};

export const CardFactory = buildTestFactory<Card>(() => {
	return mockCardData();
});
