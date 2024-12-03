import { Test, TestingModule } from '@nestjs/testing';
import { COMMENT_REPOSITORY } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CommentRepositoryInterface } from 'src/modules/comments/interfaces/repositories/comment.repository.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import { faker } from '@faker-js/faker';
import CreateCommentUseCaseDto from 'src/modules/comments/dto/useCase/create-comment.use-case.dto';
import { CreateCommentUseCase } from 'src/modules/comments/applications/create-comment.use-case';
import User from 'src/modules/users/entities/user.schema';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { CommentFactory } from 'src/libs/test-utils/mocks/factories/comment-factory.mock';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';

const userMock: User = UserFactory.create();
const board: Board = BoardFactory.create();
const newComment = CommentFactory.create({
	text: 'Test: Add comment',
	createdBy: userMock,
	anonymous: false
});

describe('CreateCommentUseCase', () => {
	let useCase: UseCase<CreateCommentUseCaseDto, Comment>;
	let commentRepositoryMock: DeepMocked<CommentRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCommentUseCase,
				{
					provide: COMMENT_REPOSITORY,
					useValue: createMock<CommentRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(CreateCommentUseCase);
		commentRepositoryMock = module.get(COMMENT_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	it('should create a comment for a card group', async () => {
		const boardWithNewCommentOnCardGroup: Board = { ...board };

		boardWithNewCommentOnCardGroup.columns[0].cards[0].comments.push(newComment);

		commentRepositoryMock.insertCardGroupComment.mockResolvedValue(boardWithNewCommentOnCardGroup);

		const commentDto: CreateCommentUseCaseDto = {
			boardId: board._id,
			cardId: board.columns[0].cards[0]._id,
			anonymous: false,
			user: userMock,
			text: 'Test: Add comment',
			socketId: faker.string.uuid(),
			columnId: board.columns[0]._id,
			completionHandler: jest.fn()
		};

		const result = await useCase.execute(commentDto);

		expect(commentRepositoryMock.insertCardGroupComment).toBeCalledTimes(1);
		expect(result).toEqual(newComment);
	});

	it('should throw an error when the creation of a comment on a card group fails', async () => {
		commentRepositoryMock.insertCardGroupComment.mockResolvedValue(null);

		const commentDto: CreateCommentUseCaseDto = {
			boardId: board._id,
			cardId: board.columns[0].cards[0]._id,
			anonymous: false,
			user: userMock,
			text: 'Test: Add comment',
			socketId: faker.string.uuid(),
			columnId: board.columns[0]._id,
			completionHandler: jest.fn()
		};
		await expect(useCase.execute(commentDto)).rejects.toThrow(InsertFailedException);
	});

	it('should create a comment for a card item', async () => {
		const boardWithNewCommentOnCardItem: Board = { ...board };

		boardWithNewCommentOnCardItem.columns[0].cards[0].items[0].comments.push(newComment);

		commentRepositoryMock.insertItemComment.mockResolvedValue(boardWithNewCommentOnCardItem);

		const commentDto: CreateCommentUseCaseDto = {
			boardId: board._id,
			cardId: board.columns[0].cards[0]._id,
			cardItemId: board.columns[0].cards[0].items[0]._id,
			anonymous: false,
			user: userMock,
			text: 'Test: Add comment',
			socketId: faker.string.uuid(),
			columnId: board.columns[0]._id,
			completionHandler: jest.fn()
		};

		const result = await useCase.execute(commentDto);

		expect(commentRepositoryMock.insertItemComment).toBeCalledTimes(1);
		expect(result).toEqual(newComment);
	});

	it('should throw an error when the creation of a comment on a card item fails', async () => {
		commentRepositoryMock.insertItemComment.mockResolvedValue(null);

		const commentDto: CreateCommentUseCaseDto = {
			boardId: board._id,
			cardId: board.columns[0].cards[0]._id,
			cardItemId: board.columns[0].cards[0].items[0]._id,
			anonymous: false,
			user: userMock,
			text: 'Test: Add comment',
			socketId: faker.string.uuid(),
			columnId: board.columns[0]._id,
			completionHandler: jest.fn()
		};
		await expect(useCase.execute(commentDto)).rejects.toThrow(InsertFailedException);
	});
});
