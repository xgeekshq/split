import { Test, TestingModule } from '@nestjs/testing';
import { COMMENT_REPOSITORY } from '../constants';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CommentRepositoryInterface } from 'src/modules/comments/interfaces/repositories/comment.repository.interface';
import { UpdateCommentUseCase } from 'src/modules/comments/applications/update-comment.use-case';
import UpdateCommentUseCaseDto from 'src/modules/comments/dto/useCase/update-comment.use-case.dto';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import faker from '@faker-js/faker';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';

const board: Board = BoardFactory.create();

describe('CreateCardUseCase', () => {
	let useCase: UseCase<UpdateCommentUseCaseDto, void>;
	let commentRepositoryMock: DeepMocked<CommentRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateCommentUseCase,
				{
					provide: COMMENT_REPOSITORY,
					useValue: createMock<CommentRepositoryInterface>()
				}
			]
		}).compile();
		useCase = module.get(UpdateCommentUseCase);
		commentRepositoryMock = module.get(COMMENT_REPOSITORY);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	it('should update a comment from a card group', async () => {
		const boardWithCommentGroupUpdated: Board = { ...board };
		boardWithCommentGroupUpdated.columns[0].cards[0].comments[0].text = 'Test';
		commentRepositoryMock.updateCardGroupComment.mockResolvedValue(boardWithCommentGroupUpdated);

		const commentDto: UpdateCommentUseCaseDto = {
			boardId: board._id,
			cardId: board.columns[0].cards[0]._id,
			isCardGroup: true,
			commentId: board.columns[0].cards[0].comments[0]._id,
			anonymous: false,
			text: 'Test',
			socketId: faker.datatype.uuid(),
			completionHandler: () => {
				return;
			}
		};

		await useCase.execute(commentDto);

		expect(commentRepositoryMock.updateCardGroupComment).toBeCalledTimes(1);
	});

	it('should update a comment from a card item', async () => {
		const boardWithCommentUpdated: Board = { ...board };
		boardWithCommentUpdated.columns[0].cards[0].items[0].comments[0].text = 'Test item';
		commentRepositoryMock.updateItemComment.mockResolvedValue(boardWithCommentUpdated);

		const commentDto: UpdateCommentUseCaseDto = {
			boardId: board._id,
			cardId: board.columns[0].cards[0].items[0]._id,
			cardItemId: board.columns[0].cards[0].items[0]._id,
			isCardGroup: false,
			commentId: board.columns[0].cards[0].items[0].comments[0]._id,
			anonymous: false,
			text: 'Test item',
			socketId: faker.datatype.uuid(),
			completionHandler: () => {
				return;
			}
		};

		await useCase.execute(commentDto);

		expect(commentRepositoryMock.updateItemComment).toBeCalledTimes(1);
	});

	it('should throw an error when the update of a comment fails', async () => {
		commentRepositoryMock.updateItemComment.mockResolvedValueOnce(null);

		const commentDto: UpdateCommentUseCaseDto = {
			boardId: board._id,
			cardId: board.columns[0].cards[0].items[0]._id,
			cardItemId: board.columns[0].cards[0].items[0]._id,
			isCardGroup: false,
			commentId: board.columns[0].cards[0].items[0].comments[0]._id,
			anonymous: false,
			text: 'Test item',
			socketId: faker.datatype.uuid(),
			completionHandler: () => {
				return;
			}
		};

		await expect(useCase.execute(commentDto)).rejects.toThrow(UpdateFailedException);
	});
});
