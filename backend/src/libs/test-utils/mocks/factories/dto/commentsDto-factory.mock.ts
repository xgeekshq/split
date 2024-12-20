import { faker } from '@faker-js/faker';
import CommentDto from 'src/modules/comments/dto/comment.dto';
import { buildTestFactory } from '../generic-factory.mock';

const mockCommentDto = () => {
	return {
		text: faker.lorem.words(),
		createdBy: faker.string.uuid(),
		anonymous: faker.datatype.boolean()
	};
};

export const CommentDtoFactory = buildTestFactory<CommentDto>(() => {
	return mockCommentDto();
});
