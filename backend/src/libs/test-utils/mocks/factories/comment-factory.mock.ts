import faker from '@faker-js/faker';
import Comment from 'src/modules/comments/schemas/comment.schema';
import { buildTestFactory } from './generic-factory.mock';
import { UserFactory } from './user-factory';

const mockCommentData = (): Comment => {
	return {
		text: faker.lorem.words(),
		createdBy: UserFactory.create(),
		anonymous: faker.datatype.boolean()
	};
};

export const CommentFactory = buildTestFactory<Comment>(() => {
	return mockCommentData();
});
