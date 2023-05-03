import { Test, TestingModule } from '@nestjs/testing';
import { COMMENT_REPOSITORY } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CommentRepositoryInterface } from 'src/modules/comments/interfaces/repositories/comment.repository.interface';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import faker from '@faker-js/faker';
import DeleteCommentUseCaseDto from 'src/modules/comments/dto/useCase/delete-comment.use-case.dto';
import { DeleteCommentUseCase } from 'src/modules/comments/applications/delete-comment.use-case';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';

const userId: string = faker.datatype.uuid();
const board: Board = BoardFactory.create();

describe('DeleteCommentUseCase', () => {
	let useCase: UseCase<DeleteCommentUseCaseDto, void>;
	let commentRepositoryMock: DeepMocked<CommentRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteCommentUseCase,
				{
					provide: COMMENT_REPOSITORY,
					useValue: createMock<CommentRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(DeleteCommentUseCase);
		commentRepositoryMock = module.get(COMMENT_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	it('should delete a comment from a card group', async () => {
		const boardWithCommentGroupDeleted: Board = { ...board };
		const commentToDelete = boardWithCommentGroupDeleted.columns[0].cards[0].comments[0]._id;

		const commentsUpdated = boardWithCommentGroupDeleted.columns[0].cards[0].comments.filter(
			(comment) => comment._id !== commentToDelete
		);

		boardWithCommentGroupDeleted.columns[0].cards[0].comments = commentsUpdated;

		commentRepositoryMock.deleteCardGroupComment.mockResolvedValue(boardWithCommentGroupDeleted);

		const commentDto: DeleteCommentUseCaseDto = {
			boardId: boardWithCommentGroupDeleted._id,
			isCardGroup: true,
			commentId: commentToDelete,
			completionHandler: () => {
				return;
			},
			userId
		};

		await useCase.execute(commentDto);

		expect(commentRepositoryMock.deleteCardGroupComment).toBeCalledTimes(1);
	});

	it('should delete a comment from a card item', async () => {
		const boardWithCommentItemDeleted: Board = { ...board };

		const commentToDelete =
			boardWithCommentItemDeleted.columns[0].cards[0].items[0].comments[0]._id;

		const commentsUpdated =
			boardWithCommentItemDeleted.columns[0].cards[0].items[0].comments.filter(
				(comment) => comment._id !== commentToDelete
			);

		boardWithCommentItemDeleted.columns[0].cards[0].items[0].comments = commentsUpdated;

		commentRepositoryMock.deleteItemComment.mockResolvedValue(boardWithCommentItemDeleted);

		const commentDto: DeleteCommentUseCaseDto = {
			boardId: boardWithCommentItemDeleted._id,
			isCardGroup: false,
			commentId: commentToDelete,
			completionHandler: () => {
				return;
			},
			userId
		};

		await useCase.execute(commentDto);

		expect(commentRepositoryMock.deleteItemComment).toBeCalledTimes(1);
	});

	it('should throw an error when the deletion of a comment fails', async () => {
		const commentToDelete = board.columns[0].cards[0].comments[0]._id;

		commentRepositoryMock.deleteCardGroupComment.mockResolvedValueOnce(null);

		const commentDto: DeleteCommentUseCaseDto = {
			boardId: board._id,
			isCardGroup: true,
			commentId: commentToDelete,
			completionHandler: () => {
				return;
			},
			userId
		};

		await expect(useCase.execute(commentDto)).rejects.toThrow(DeleteFailedException);
	});
});
