import faker from '@faker-js/faker';
import CardDto from 'src/modules/cards/dto/card.dto';
import { buildTestFactory } from '../generic-factory.mock';
import { CardItemDtoFactory } from './cardItemDto-factory.mock';
import { CommentDtoFactory } from './commentsDto-factory.mock';

const mockCardDto = () => {
	return {
		items: [CardItemDtoFactory.create()],
		id: faker.database.mongodbObjectId(),
		text: faker.lorem.words(),
		createdBy: faker.datatype.uuid(),
		comments: [CommentDtoFactory.create()],
		votes: [],
		anonymous: faker.datatype.boolean()
	};
};

export const CardDtoFactory = buildTestFactory<CardDto>(() => {
	return mockCardDto();
});
