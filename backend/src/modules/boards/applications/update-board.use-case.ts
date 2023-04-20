import { Inject, Injectable } from '@nestjs/common';
import { BoardNotFoundException } from 'src/libs/exceptions/boardNotFoundException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { getIdFromObjectId } from 'src/libs/utils/getIdFromObjectId';
import isEmpty from 'src/libs/utils/isEmpty';
import BoardUserDto from 'src/modules/boardUsers/dto/board.user.dto';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import ColumnDto from 'src/modules/columns/dto/column.dto';
import Column from 'src/modules/columns/entities/column.schema';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import User from 'src/modules/users/entities/user.schema';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'src/modules/votes/constants';
import { UpdateBoardDto } from '../dto/update-board.dto';
import Board from '../entities/board.schema';
import { ResponsibleType } from '../interfaces/responsible.interface';
import { BOARD_REPOSITORY } from '../constants';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import {
	GET_BOARD_USER_SERVICE,
	UPDATE_BOARD_USER_SERVICE
} from 'src/modules/boardUsers/constants';

@Injectable()
export class UpdateBoardUseCase implements UseCase<UpdateBoardDto, Board> {
	constructor(
		@Inject(BOARD_REPOSITORY)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(GET_BOARD_USER_SERVICE)
		private readonly getBoardUserService: GetBoardUserServiceInterface,
		@Inject(UPDATE_BOARD_USER_SERVICE)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private readonly deleteVoteService: DeleteVoteServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private readonly slackCommunicationService: CommunicationServiceInterface
	) {}

	async execute(boardData: UpdateBoardDto) {
		const { boardId, completionHandler } = boardData;
		/**
		 * Only can change the maxVotes if:
		 * - new maxVotes not empty
		 * - current highest votes equals to zero
		 * - or current highest votes lower than new maxVotes
		 */

		if (!isEmpty(boardData.maxVotes)) {
			const highestVotes = await this.getHighestVotesOnBoard(boardId);

			if (highestVotes > Number(boardData.maxVotes)) {
				throw new UpdateFailedException(
					`You can't set a lower value to max votes. Please insert a value higher or equals than ${highestVotes}!`
				);
			}
		}

		let board = await this.boardRepository.getBoard(boardId);

		if (!board) {
			throw new BoardNotFoundException();
		}

		// Destructuring board/boardData variables
		const { isSubBoard } = board;
		const { responsible } = boardData;

		const currentResponsible = await this.getBoardResponsibleInfo(boardId);
		const newResponsible: ResponsibleType = {
			id: (responsible?.user as User)._id,
			email: (responsible?.user as User).email
		};

		/**
		 * Validate if:
		 * - have users on request
		 * - and the current responsible isn't the new responsible
		 */
		if (boardData.users && String(currentResponsible?.id) !== String(newResponsible?.id)) {
			this.changeResponsibleOnBoard(
				isSubBoard,
				boardId,
				boardData.mainBoardId,
				boardData.users,
				String(currentResponsible.id),
				String(newResponsible.id)
			);
		}

		/**
		 * Updates the board's settings fields
		 *
		 * */
		board = {
			...board,
			title: boardData.title,
			maxVotes: boardData.maxVotes,
			hideCards: boardData.hideCards,
			addCards: boardData.addCards,
			hideVotes: boardData.hideVotes,
			postAnonymously: boardData.postAnonymously,
			isPublic: boardData.isPublic
		};

		/**
		 * If the board is a regular, then updates its columns
		 *
		 * */
		if (!isSubBoard && isEmpty(board.dividedBoards)) {
			board.columns = await this.updateRegularBoard(boardId, boardData, board);
		}

		const updatedBoard = await this.boardRepository.updateBoard(boardId, board, true);

		if (!updatedBoard) throw new UpdateFailedException();

		if (boardData.socketId) {
			completionHandler();
		}

		const hasNewResponsible =
			newResponsible &&
			currentResponsible &&
			String(currentResponsible?.id) !== String(newResponsible?.id);

		const boardHasSlackEnableAndISSubBoard =
			board.slackChannelId && updatedBoard.slackEnable && updatedBoard.isSubBoard;

		if (hasNewResponsible && boardHasSlackEnableAndISSubBoard) {
			this.handleResponsibleSlackMessage(
				newResponsible,
				currentResponsible,
				board._id,
				board.slackChannelId,
				board.boardNumber
			);
		}

		return updatedBoard;
	}

	/* --------------- HELPERS --------------- */

	/**
	 * Method to get the highest value of votesCount on Board Users
	 * @param boardId String
	 * @return number
	 */
	private async getHighestVotesOnBoard(boardId: string): Promise<number> {
		const votesCount = await this.getBoardUserService.getVotesCount(boardId);

		return votesCount.reduce(
			(prev, current) => (current.votesCount > prev ? current.votesCount : prev),
			0
		);
	}

	/**
	 * Method to get current responsible to a specific board
	 * @param boardId String
	 * @return Board User
	 * @private
	 */
	private async getBoardResponsibleInfo(boardId: string): Promise<ResponsibleType | undefined> {
		const boardUser = await this.getBoardUserService.getBoardResponsible(boardId);

		if (!boardUser) {
			return undefined;
		}

		const user = boardUser?.user as User;

		return { id: user._id, email: user.email };
	}

	/**
	 * Method to update all boardUsers role
	 * @param boardId String
	 * @param boardUsers BoardUserDto[]
	 * @param currentResponsibleId String
	 * @param newResponsibleId String
	 * @return void
	 * @private
	 */
	private async updateBoardUsersRole(
		boardId: string,
		boardUsers: BoardUserDto[],
		currentResponsibleId: string,
		newResponsibleId: string
	) {
		const promises = boardUsers
			.filter((boardUser) =>
				[getIdFromObjectId(currentResponsibleId), newResponsibleId].includes(
					(boardUser.user as User)._id
				)
			)
			.map((boardUser) => {
				const typedBoardUser = boardUser.user as User;

				return this.updateBoardUserService.updateBoardUserRole(
					boardId,
					typedBoardUser._id,
					boardUser.role
				);
			});
		await Promise.all(promises);
	}

	/**
	 * Method to change board responsible
	 * @return void
	 */
	private changeResponsibleOnBoard(
		isSubBoard: boolean,
		boardId: string,
		mainBoardId: string,
		users: BoardUserDto[],
		currentResponsibleId: string,
		newResponsibleId: string
	) {
		if (isSubBoard) {
			this.updateBoardUsersRole(boardId, users, currentResponsibleId, newResponsibleId);
		}

		this.updateBoardUsersRole(mainBoardId, users, currentResponsibleId, newResponsibleId);
	}

	/**
	 * Method to delete votes from card if there are columns to delete or to update column name on a regular board
	 * @return Columns
	 * @private
	 */
	private async updateRegularBoard(boardId: string, boardData: UpdateBoardDto, board: Board) {
		/**
		 * Validate if:
		 * - have columns to delete
		 * Returns the votes to the user
		 */
		if (boardData.deletedColumns && !isEmpty(boardData.deletedColumns)) {
			const cardsToDelete = boardData.deletedColumns.flatMap((deletedColumnId: string) => {
				return board.columns.find((column) => column._id.toString() === deletedColumnId)?.cards;
			});

			await this.deleteVoteService.deleteCardVotesFromColumn(boardId, cardsToDelete);
		}

		/**
		 * Updates the columns
		 *
		 * */
		const columns = boardData.columns.flatMap((col: Column | ColumnDto) => {
			if (col._id) {
				const columnBoard = board.columns.find(
					(colBoard) => colBoard._id.toString() === col._id.toString()
				);

				if (boardData.deletedColumns) {
					const columnToDelete = boardData.deletedColumns.some(
						(colId) => colId === col._id.toString()
					);

					if (columnToDelete) {
						return [];
					}
				}

				if (columnBoard) {
					return [{ ...columnBoard, title: col.title }];
				}
			}

			return [{ ...col }];
		}) as Column[];

		return columns;
	}

	/**
	 * Method to add new responsible to the slack responsible channel
	 * @private
	 */
	private async handleResponsibleSlackMessage(
		newResponsible: ResponsibleType,
		currentResponsible: ResponsibleType | undefined,
		boardId: string,
		slackChannelId: string,
		boardNumber: number
	) {
		this.slackCommunicationService.executeResponsibleChange({
			newResponsibleEmail: newResponsible.email,
			previousResponsibleEmail: currentResponsible?.email ?? '',
			subTeamChannelId: slackChannelId,
			responsiblesChannelId: (await this.boardRepository.getResponsiblesSlackId(boardId))
				?.slackChannelId,
			teamNumber: boardNumber,
			email: newResponsible.email
		});
	}
}
