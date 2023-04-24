import { Inject, Injectable, Logger } from '@nestjs/common';
import { DELETE_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import isEmpty from 'src/libs/utils/isEmpty';
import { GetCardServiceInterface } from 'src/modules/cards/interfaces/services/get.card.service.interface';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { VOTE_REPOSITORY } from '../constants';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import Card from 'src/modules/cards/entities/card.schema';
import {
	getUserWithVotes,
	mergeTwoUsersWithVotes
} from 'src/modules/cards/utils/get-user-with-votes';
import { votesArrayVerification } from '../utils/votesArrayVerification';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import {
	GET_BOARD_USER_SERVICE,
	UPDATE_BOARD_USER_SERVICE
} from 'src/modules/boardUsers/constants';
import { GET_CARD_SERVICE } from 'src/modules/cards/constants';

@Injectable()
export default class DeleteVoteService implements DeleteVoteServiceInterface {
	constructor(
		@Inject(VOTE_REPOSITORY)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(GET_BOARD_USER_SERVICE)
		private readonly getBoardUserService: GetBoardUserServiceInterface,
		@Inject(UPDATE_BOARD_USER_SERVICE)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(GET_CARD_SERVICE)
		private readonly getCardService: GetCardServiceInterface,
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface
	) {}

	private logger: Logger = new Logger(DeleteVoteService.name);

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

	async deleteCardVotesFromColumn(boardId: string, cardsArray: Card[]) {
		await this.updateBoardUserService.startTransaction();
		try {
			await this.deleteVotesFromCards(boardId, cardsArray);
			await this.updateBoardUserService.commitTransaction();
		} catch (e) {
			throw new DeleteFailedException(DELETE_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
		}
	}

	async canUserDeleteVote(
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

	async verifyIfUserCanDeleteVote(
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

		const boardUser = await this.getBoardUserService.getBoardUser(boardId, userId);

		if (!boardUser) {
			return false;
		}

		const card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) return false;

		const ifVotesIncludesUser = this.ifVotesIncludesUserId(card, String(userId), cardItemId);

		if (!ifVotesIncludesUser) {
			return false;
		}

		return boardUser.votesCount
			? boardUser.votesCount > 0 && boardUser.votesCount - Math.abs(count) >= 0
			: false;
	}

	async removeVotesFromCardItem(
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

	async getCardItemFromBoard(boardId: string, cardId: string, cardItemId?: string) {
		const card = await this.getCardFromBoard(boardId, cardId);

		const cardItem = card.items.find((item) => item._id.toString() === cardItemId);

		if (!cardItem) throw new DeleteFailedException(DELETE_VOTE_FAILED);

		return cardItem;
	}

	async getCardFromBoard(boardId: string, cardId: string) {
		const card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) throw new DeleteFailedException(DELETE_VOTE_FAILED);

		return card;
	}

	/* --------------- HELPERS --------------- */

	private ifVotesIncludesUserId(card: Card, userId: string, cardItemId?: string) {
		if (cardItemId) {
			const item = card.items.find((item) => String(item._id) === String(cardItemId));

			return votesArrayVerification(item.votes as string[], userId);
		} else {
			let votes = card.votes as string[];
			card.items.forEach((item) => {
				votes = votes.concat(item.votes as string[]);
			});

			return votesArrayVerification(votes, userId);
		}
	}

	private async deleteVotesFromCards(boardId, cardsArray: Card[]) {
		try {
			let usersWithVotes: Map<string, number>;

			cardsArray.map((card) => {
				const usersWithVotesToAdd = this.mergeUsersVotes(card);
				usersWithVotes = mergeTwoUsersWithVotes(usersWithVotes, usersWithVotesToAdd);
			});

			if (usersWithVotes.size > 0) {
				await this.deletedVotesFromCard(boardId, usersWithVotes);
			}
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			throw new UpdateFailedException(UPDATE_FAILED);
		}
	}

	private async deletedVotesFromCard(boardId: string, usersWithVotes: Map<string, number>) {
		try {
			const result = await this.updateBoardUserService.updateManyUserVotes(
				boardId,
				usersWithVotes,
				true,
				true
			);

			if (!result.ok) {
				throw new UpdateFailedException(UPDATE_FAILED);
			}
		} catch (e) {
			this.logger.error(e);
			throw new UpdateFailedException(UPDATE_FAILED);
		}
	}

	//Merge card.votes with items votes
	private mergeUsersVotes(card: Card): Map<string, number> {
		let cardWithVotes: Map<string, number>;
		let itemsWithVotes: Map<string, number>;
		let usersWithVotes: Map<string, number>;

		if (Object.keys(card.items).length === 1) {
			usersWithVotes = getUserWithVotes(card.items[0].votes);
		}

		if (Object.keys(card.items).length > 1) {
			card.items.forEach((item) => {
				itemsWithVotes = getUserWithVotes(item.votes);
				usersWithVotes = mergeTwoUsersWithVotes(usersWithVotes, itemsWithVotes);
			});
		}

		if (!isEmpty(card.votes)) {
			cardWithVotes = getUserWithVotes(card.votes);
			usersWithVotes = mergeTwoUsersWithVotes(usersWithVotes, cardWithVotes);
		}

		return usersWithVotes;
	}
}
