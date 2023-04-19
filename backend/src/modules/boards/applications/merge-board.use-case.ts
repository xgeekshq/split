import { Inject, Injectable, Logger } from '@nestjs/common';
import { BoardNotFoundException } from 'src/libs/exceptions/boardNotFoundException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import MergeBoardUseCaseDto from '../dto/useCase/merge-board.use-case.dto';
import Board from '../entities/board.schema';
import { TYPES } from '../constants';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { generateNewSubColumns } from '../utils/generate-subcolumns';
import { mergeCardsFromSubBoardColumnsIntoMainBoard } from '../utils/merge-cards-from-subboard';

@Injectable()
export class MergeBoardUseCase implements UseCase<MergeBoardUseCaseDto, Board> {
	private logger = new Logger(MergeBoardUseCase.name);

	constructor(
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private readonly slackCommunicationService: CommunicationServiceInterface
	) {}

	async execute({ subBoardId, userId, socketId, completionHandler }: MergeBoardUseCaseDto) {
		const [subBoard, board] = await Promise.all([
			this.boardRepository.getBoard(subBoardId),
			this.boardRepository.getBoardByQuery({ dividedBoards: { $in: [subBoardId] } })
		]);

		if (!subBoard || !board || subBoard.submitedByUser) {
			throw new BoardNotFoundException();
		}

		await this.boardRepository.startTransaction();

		try {
			const mergedBoard = await this.mergeBoards(
				subBoardId,
				userId,
				completionHandler,
				subBoard,
				board,
				socketId
			);

			await this.boardRepository.commitTransaction();

			return mergedBoard;
		} catch (e) {
			throw new UpdateFailedException();
		} finally {
			await this.boardRepository.endSession();
		}
	}

	/* --------------- HELPERS --------------- */

	private async mergeBoards(
		subBoardId: string,
		userId: string,
		completionHandler: () => void,
		subBoard: Board,
		board: Board,
		socketId?: string
	) {
		try {
			const columnsWithMergedCards = this.getColumnsFromMainBoardWithMergedCards(subBoard, board);
			let mergedBoard: Board = null;

			const updatedMergedSubBoard = await this.boardRepository.updateMergedSubBoard(
				subBoardId,
				userId,
				true
			);

			if (!updatedMergedSubBoard) {
				this.logger.error('Update of the subBoard to be merged failed');
				throw new UpdateFailedException();
			}

			mergedBoard = await this.boardRepository.updateMergedBoard(
				board._id,
				columnsWithMergedCards,
				true
			);

			if (!mergedBoard) {
				this.logger.error('Update of the merged board failed');
				throw new UpdateFailedException();
			}

			if (board.slackChannelId && board.slackEnable) {
				this.slackCommunicationService.executeMergeBoardNotification({
					responsiblesChannelId: board.slackChannelId,
					teamNumber: subBoard.boardNumber,
					isLastSubBoard: await this.checkIfIsLastBoardToMerge(
						mergedBoard.dividedBoards as Board[]
					),
					boardId: subBoardId,
					mainBoardId: board._id
				});
			}

			if (socketId) {
				completionHandler();
			}

			return mergedBoard;
		} catch (e) {
			await this.boardRepository.abortTransaction();
			throw new UpdateFailedException();
		}
	}

	private checkIfIsLastBoardToMerge(dividedBoards: Board[]): boolean {
		const count = dividedBoards.reduce((prev, currentValue) => {
			if (currentValue.submitedByUser) {
				return prev + 1;
			}

			return prev;
		}, 0);

		return count === dividedBoards.length;
	}

	/**
	 * Method to return columns with cards merged cards a from sub-board
	 * @param subBoard: Board
	 * @param board: Board
	 * @return Column[]
	 */
	private getColumnsFromMainBoardWithMergedCards(subBoard: Board, board: Board) {
		const newSubColumns = generateNewSubColumns(subBoard);

		return mergeCardsFromSubBoardColumnsIntoMainBoard([...board.columns], newSubColumns);
	}
}
