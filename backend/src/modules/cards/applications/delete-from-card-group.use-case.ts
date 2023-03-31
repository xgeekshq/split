import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'src/modules/votes/interfaces/types';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { DELETE_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import DeleteFromCardGroupUseCaseDto from '../dto/useCase/delete-fom-card-group.use-case.dto';
import User from 'src/modules/users/entities/user.schema';
import { ObjectId } from 'mongoose';
import CardItem from '../entities/card.item.schema';
import Comment from 'src/modules/comments/schemas/comment.schema';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { getUserWithVotes } from '../utils/get-user-with-votes';

@Injectable()
export class DeleteFromCardGroupUseCase implements UseCase<DeleteFromCardGroupUseCaseDto, void> {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardServiceInterface,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	async execute(deleteFromCardGroupUseCaseDto: DeleteFromCardGroupUseCaseDto) {
		const { boardId, cardId, cardItemId } = deleteFromCardGroupUseCaseDto;
		this.cardRepository.startTransaction();
		try {
			await this.deletedVotesFromCardItem(boardId, cardItemId);
			const card = await this.getCardService.getCardFromBoard(boardId, cardId);
			const cardItems = card?.items.filter((item) => item._id.toString() !== cardItemId);

			if (
				card &&
				cardItems?.length === 1 &&
				(card.votes.length >= 0 || card.comments.length >= 0)
			) {
				const newVotes = [...card.votes, ...cardItems[0].votes];
				const newComments = [...card.comments, ...cardItems[0].comments];
				await this.refactorLastItem(boardId, cardId, newVotes, newComments, cardItems);
			}
			const result = await this.cardRepository.deleteCardFromCardItems(
				boardId,
				cardId,
				cardItemId,
				true
			);

			if (result.modifiedCount != 1) throw new UpdateFailedException();
			await this.cardRepository.commitTransaction();
		} catch (e) {
			await this.cardRepository.abortTransaction();
		} finally {
			await this.cardRepository.endSession();
		}
	}

	private async deletedVotesFromCardItem(boardId: string, cardItemId: string) {
		const getCardItem = await this.getCardService.getCardItemFromGroup(boardId, cardItemId);

		if (!getCardItem) {
			throw Error(UPDATE_FAILED);
		}
		const usersWithVotes = getUserWithVotes(getCardItem.votes);

		if (getCardItem.votes?.length) {
			try {
				const result = await this.updateBoardUserService.updateManyVoteUsers(
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
	}

	private async refactorLastItem(
		boardId: string,
		cardId: string,
		newVotes: (User | ObjectId | string)[],
		newComments: Comment[],
		cardItems: CardItem[]
	) {
		const boardWithLastCardRefactored = await this.cardRepository.refactorLastCardItem(
			boardId,
			cardId,
			newVotes,
			newComments,
			cardItems
		);

		if (!boardWithLastCardRefactored) throw Error(UPDATE_FAILED);
	}
}
