import faker from '@faker-js/faker';
import CardDto from 'src/modules/cards/dto/card.dto';
import { buildTestFactory } from '../generic-factory.mock';
import { cardItemDtoFactory } from './cardItemDto-factory.mock';
import { commentDtoFactory } from './commentsDto-factory.mock';

const mockCardDto = () => {
	return {
		items: [cardItemDtoFactory.create()],
		id: faker.database.mongodbObjectId(),
		text: faker.lorem.words(),
		createdBy: faker.datatype.uuid(),
		comments: [commentDtoFactory.create()],
		votes: [],
		anonymous: faker.datatype.boolean()
	};
};

export const cardDtoFactory = buildTestFactory<CardDto>(() => {
	return mockCardDto();
});
