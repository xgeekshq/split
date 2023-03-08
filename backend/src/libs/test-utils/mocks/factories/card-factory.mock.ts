import faker from '@faker-js/faker';
import Card from 'src/modules/cards/schemas/card.schema';
import { buildTestFactory } from './generic-factory.mock';

const userId = faker.datatype.uuid();
const cardId = faker.datatype.uuid();
const cardText = faker.lorem.words();
const commentText = faker.lorem.paragraph(1);
const teamId = faker.datatype.uuid();
const createdAtDate = faker.datatype.datetime();

const mockCardData = (): Card => {
	return {
		_id: cardId,
		text: cardText,
		createdBy: userId,
		createdByTeam: teamId,
		createdAt: createdAtDate,
		comments: [
			{
				text: commentText,
				createdBy: userId,
				anonymous: false
			}
		],
		votes: [],
		anonymous: false,
		items: [
			{
				_id: cardId,
				text: cardText,
				createdBy: userId,
				comments: [
					{
						text: commentText,
						createdBy: userId,
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
