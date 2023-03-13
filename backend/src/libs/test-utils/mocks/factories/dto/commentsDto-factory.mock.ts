import faker from '@faker-js/faker';
import CommentDto from 'src/modules/comments/dto/comment.dto';
import { buildTestFactory } from '../generic-factory.mock';

const mockCommentDto = () => {
	return {
		text: faker.lorem.words(),
		createdBy: faker.datatype.uuid(),
		anonymous: faker.datatype.boolean()
	};
};

export const commentDtoFactory = buildTestFactory<CommentDto>(() => {
	return mockCommentDto();
});
