import faker from '@faker-js/faker';
import CardItemDto from 'src/modules/cards/dto/card.item.dto';
import { buildTestFactory } from '../generic-factory.mock';
import { commentDtoFactory } from './commentsDto-factory.mock';

const mockCardItemDto = () => {
	return {
		id: faker.database.mongodbObjectId(),
		text: faker.lorem.words(),
		createdBy: faker.datatype.uuid(),
		comments: [commentDtoFactory.create()],
		votes: [],
		anonymous: faker.datatype.boolean()
	};
};

export const cardItemDtoFactory = buildTestFactory<CardItemDto>(() => {
	return mockCardItemDto();
});
