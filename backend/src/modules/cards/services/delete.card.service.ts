import { Inject, Injectable } from '@nestjs/common';
import { DeleteCardServiceInterface } from '../interfaces/services/delete.card.service.interface';
import Card from '../entities/card.schema';
import { getUserWithVotes, mergeTwoUsersWithVotes } from '../utils/get-user-with-votes';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { DELETE_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';

@Injectable()
export default class DeleteCardService implements DeleteCardServiceInterface {
	constructor(
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	async deleteCardVotesFromColumn(boardId: string, cardsArray: Card[]) {
		await this.updateBoardUserService.startTransaction();
		try {
			await this.deleteVotesFromCards(boardId, cardsArray);
			await this.updateBoardUserService.commitTransaction();
		} catch (e) {
			throw new DeleteFailedException();
		} finally {
			await this.updateBoardUserService.endSession();
		}
	}

	private async deleteVotesFromCards(boardId, cardsArray: Card[]) {
		try {
			const promises = cardsArray.map((card) => {
				const usersWithVotes = this.mergeUsersVotes(card);

				if (usersWithVotes.size > 0) {
					return this.deletedVotesFromCard(boardId, usersWithVotes);
				}
			});
			await Promise.all(promises);
		} catch {
			await this.updateBoardUserService.abortTransaction();
			throw Error();
		}
	}

	private async deletedVotesFromCard(boardId: string, usersWithVotes) {
		try {
			const result = await this.updateBoardUserService.updateManyUserVotes(
				boardId,
				usersWithVotes,
				true,
				true
			);

			if (result.ok !== 1) {
				throw new Error(DELETE_VOTE_FAILED);
			}
		} catch (e) {
			throw new Error(e.message);
		}
	}

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

		if (card.votes?.length) {
			cardWithVotes = getUserWithVotes(card.votes);
			usersWithVotes = mergeTwoUsersWithVotes(usersWithVotes, cardWithVotes);
		}

		return usersWithVotes;
	}
}
