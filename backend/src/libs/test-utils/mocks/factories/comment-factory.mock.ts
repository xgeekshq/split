import faker from '@faker-js/faker';
import Comment from 'src/modules/comments/entities/comment.schema';
import { buildTestFactory } from './generic-factory.mock';
import { UserFactory } from './user-factory';

const mockCommentData = (): Comment => {
	return {
		text: faker.lorem.words(),
		createdBy: UserFactory.create(),
		anonymous: faker.datatype.boolean(),
		_id: faker.datatype.uuid()
	};
};

export const CommentFactory = buildTestFactory<Comment>(() => {
	return mockCommentData();
});
