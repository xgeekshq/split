import faker from '@faker-js/faker';
import Card from 'src/modules/cards/entities/card.schema';
import { buildTestFactory } from './generic-factory.mock';
import { UserFactory } from './user-factory';

const cardId = faker.datatype.uuid();
const cardText = faker.lorem.words(5);
const commentText = faker.lorem.words(4);
const teamId = faker.datatype.uuid();
const createdAtDate = faker.datatype.datetime();
const user = UserFactory.create();

const mockCardData = (): Card => {
	return {
		_id: cardId,
		text: cardText,
		createdBy: user,
		createdByTeam: teamId,
		createdAt: createdAtDate,
		comments: [
			{
				text: commentText,
				createdBy: user,
				anonymous: false
			}
		],
		votes: [],
		anonymous: false,
		items: [
			{
				_id: cardId,
				text: cardText,
				createdBy: user,
				comments: [
					{
						text: commentText,
						createdBy: user,
						anonymous: false
					}
				],
				votes: [],
				anonymous: false,
				createdByTeam: teamId,
				createdAt: createdAtDate
			}
		]
	};
};

export const CardFactory = buildTestFactory<Card>(() => {
	return mockCardData();
});
