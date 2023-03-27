import { Inject, Injectable, Logger } from '@nestjs/common';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { DELETE_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { arrayIdToString } from 'src/libs/utils/arrayIdToString';
import isEmpty from 'src/libs/utils/isEmpty';
import { GetCardServiceInterface } from 'src/modules/cards/interfaces/services/get.card.service.interface';
import * as Cards from 'src/modules/cards/interfaces/types';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { TYPES } from '../interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';

@Injectable()
export default class DeleteVoteService implements DeleteVoteServiceInterface {
	constructor(
		@Inject(TYPES.repositories.VoteRepository)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(Cards.TYPES.services.GetCardService)
		private getCardService: GetCardServiceInterface,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	private logger: Logger = new Logger('DeleteVoteService');

	async decrementVoteUser(boardId: string, userId: string, count?: number, withSession?: boolean) {
		const updatedBoardUser = await this.updateBoardUserService.updateVoteUser(
			boardId,
			userId,
			count,
			withSession,
			true
		);

		if (!updatedBoardUser) throw new UpdateFailedException();
	}

	async deleteVoteFromCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number,
		retryCount?: number
	) {
		await this.canUserDeleteVote(boardId, userId, count, cardId, cardItemId);

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		const cardItem = await this.getCardItemFromBoard(boardId, cardId, cardItemId);

		let votes = cardItem.votes as string[];

		const userVotes = votes.filter((vote) => vote.toString() === userId.toString());
		votes = votes.filter((vote) => vote.toString() !== userId.toString());
		userVotes.splice(0, Math.abs(count));
		votes = votes.concat(userVotes);

		try {
			await this.removeVotesFromCardItemAndUserOperations(
				boardId,
				cardItemId,
				votes,
				cardId,
				count,
				userId,
				retryCount
			);

			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			throw new DeleteFailedException(DELETE_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	async deleteVoteFromCardGroup(
		boardId: string,
		cardId: string,
		userId: string,
		count: number,
		retryCount?: number
	) {
		await this.canUserDeleteVote(boardId, userId, count, cardId);

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		const currentCount = Math.abs(count);

		const card = await this.getCardFromBoard(boardId, cardId);

		const mappedVotes = card.votes as string[];
		const userVotes = mappedVotes.filter((vote) => vote.toString() === userId.toString());

		if (!isEmpty(userVotes)) {
			await this.deleteUserVotes(
				mappedVotes,
				userVotes,
				boardId,
				cardId,
				userId,
				count,
				currentCount,
				retryCount
			);
		}

		if (!isEmpty(currentCount)) {
			await this.deleteVotesWhileCurrentCountIsNotEmpty(currentCount, boardId, cardId, userId);
		}
	}

	/* #################### HELPERS #################### */

	private async verifyIfUserCanDeleteVote(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		cardItemId?: string
	): Promise<boolean> {
		const board = await this.getBoardService.getBoardById(boardId);

		if (!board) {
			return false;
		}
		const boardUserFound = await this.getBoardUserService.getBoardUser(boardId, userId);

		if (!boardUserFound) {
			return false;
		}

		const card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) return false;

		if (cardItemId) {
			const item = card.items.find((item) => item._id === cardItemId);
			this.ifVotesIncludeUserId(item.votes as string[], String(userId));
		} else {
			let votes = card.votes as string[];
			card.items.forEach((item) => {
				votes = votes.concat(item.votes as string[]);
			});

			this.ifVotesIncludeUserId(votes, String(userId));
		}

		return boardUserFound?.votesCount
			? boardUserFound.votesCount > 0 && boardUserFound.votesCount - Math.abs(count) >= 0
			: false;
	}

	private ifVotesIncludeUserId(votes: string[], userId: string) {
		if (!arrayIdToString(votes).includes(userId)) {
			return false;
		}
	}

	private async canUserDeleteVote(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		cardItemId?: string
	) {
		const canUserDeleteVote = await this.verifyIfUserCanDeleteVote(
			boardId,
			userId,
			count,
			cardId,
			cardItemId
		);

		if (!canUserDeleteVote) throw new DeleteFailedException(DELETE_VOTE_FAILED);
	}

	private async getCardFromBoard(boardId: string, cardId: string) {
		const card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) throw new DeleteFailedException(DELETE_VOTE_FAILED);

		return card;
	}

	private async getCardItemFromBoard(boardId: string, cardId: string, cardItemId?: string) {
		const card = await this.getCardFromBoard(boardId, cardId);

		const cardItem = card.items.find((item) => item._id.toString() === cardItemId);

		if (!cardItem) throw new DeleteFailedException(DELETE_VOTE_FAILED);

		return cardItem;
	}

	private async removeVotesFromCardItemAndUserOperations(
		boardId: string,
		cardItemId: string,
		votes: string[],
		cardId: string,
		count: number,
		userId: string,
		retryCount?: number
	) {
		let retryCountOperation = retryCount ?? 0;
		const withSession = true;

		try {
			await this.removeVotesFromCardItem(boardId, cardItemId, votes, cardId, withSession);
			await this.decrementVoteUser(boardId, userId, count, withSession);
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.deleteVoteFromCard(
					boardId,
					cardId,
					userId,
					cardItemId,
					count,
					retryCountOperation
				);
			} else {
				throw new DeleteFailedException(DELETE_VOTE_FAILED);
			}
		}
	}

	private async removeVotesFromCardGroup(
		boardId: string,
		mappedVotes: string[],
		cardId: string,
		withSession?: boolean
	) {
		const updatedBoard = await this.voteRepository.removeVotesFromCard(
			boardId,
			mappedVotes,
			cardId,
			withSession
		);

		if (!updatedBoard) throw new DeleteFailedException(DELETE_VOTE_FAILED);
	}

	private async removeVotesFromCardItem(
		boardId: string,
		cardItemId: string,
		votes: string[],
		cardId: string,
		withSession?: boolean
	) {
		const updatedBoard = await this.voteRepository.removeVotesFromCardItem(
			boardId,
			cardId,
			cardItemId,
			votes,
			withSession
		);

		if (!updatedBoard) throw new DeleteFailedException(DELETE_VOTE_FAILED);
	}

	private async deleteVotesWhileCurrentCountIsNotEmpty(
		currentCount: number,
		boardId: string,
		cardId: string,
		userId: string
	) {
		while (currentCount > 0) {
			const card = await this.getCardFromBoard(boardId, cardId);

			const item = card.items.find(({ votes: itemVotes }) =>
				arrayIdToString(itemVotes as unknown as string[]).includes(userId.toString())
			);

			if (!item) return null;

			const votesOfUser = (item.votes as unknown as string[]).filter(
				(vote) => vote.toString() === userId.toString()
			);

			const itemVotesToReduce =
				votesOfUser.length / currentCount >= 1 ? currentCount : votesOfUser.length;

			await this.deleteVoteFromCard(
				boardId,
				cardId,
				userId,
				item._id.toString(),
				-itemVotesToReduce
			);

			currentCount -= itemVotesToReduce;
		}
	}

	private async deleteVotesFromCardGroupAndUserOperations(
		boardId: string,
		mappedVotes: string[],
		cardId: string,
		votesToReduce: number,
		userId: string,
		count: number,
		retryCount?: number
	) {
		let retryCountOperation = retryCount ?? 0;
		const withSession = true;
		try {
			await this.removeVotesFromCardGroup(boardId, mappedVotes, cardId, withSession);
			await this.decrementVoteUser(boardId, userId, -votesToReduce, withSession);
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.deleteVoteFromCardGroup(boardId, cardId, userId, count, retryCount);
			} else {
				throw new DeleteFailedException(DELETE_VOTE_FAILED);
			}
		}
	}

	private async deleteUserVotes(
		votes: string[],
		userVotes: string[],
		boardId: string,
		cardId: string,
		userId: string,
		count: number,
		currentCount: number,
		retryCount?: number
	) {
		let mappedVotes = votes.filter((vote) => vote.toString() !== userId.toString());
		const votesToReduce = userVotes.length / currentCount >= 1 ? currentCount : userVotes.length;
		userVotes.splice(0, Math.abs(votesToReduce));

		mappedVotes = mappedVotes.concat(userVotes);

		try {
			await this.deleteVotesFromCardGroupAndUserOperations(
				boardId,
				mappedVotes,
				cardId,
				votesToReduce,
				userId,
				count,
				retryCount
			);
			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			throw new DeleteFailedException(DELETE_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}

		currentCount -= Math.abs(votesToReduce);

		if (currentCount === 0) return;
	}
}
