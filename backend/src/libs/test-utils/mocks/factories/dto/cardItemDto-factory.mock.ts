import faker from '@faker-js/faker';
import CardItemDto from 'src/modules/cards/dto/card.item.dto';
import { buildTestFactory } from '../generic-factory.mock';
import { CommentDtoFactory } from './commentsDto-factory.mock';

const mockCardItemDto = () => {
	return {
		id: faker.database.mongodbObjectId(),
		text: faker.lorem.words(),
		createdBy: faker.datatype.uuid(),
		comments: [CommentDtoFactory.create()],
		votes: [],
		anonymous: faker.datatype.boolean()
	};
};

export const CardItemDtoFactory = buildTestFactory<CardItemDto>(() => {
	return mockCardItemDto();
});
