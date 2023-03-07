import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { DELETE_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { arrayIdToString } from 'src/libs/utils/arrayIdToString';
import isEmpty from 'src/libs/utils/isEmpty';
import Board from 'src/modules/boards/entities/board.schema';
import { GetCardServiceInterface } from 'src/modules/cards/interfaces/services/get.card.service.interface';
import * as Cards from 'src/modules/cards/interfaces/types';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { TYPES } from '../interfaces/types';
import { VotesBoardUserRepositoryInterface } from '../repositories/votes-board-user.repository.interface';
import { VotesBoardRepositoryInterface } from '../repositories/votes-board.repository.interface';

@Injectable()
export default class DeleteVoteService implements DeleteVoteServiceInterface {
	constructor(
		@Inject(TYPES.repositories.VotesBoardRepository)
		private readonly boardRepository: VotesBoardRepositoryInterface,
		@Inject(TYPES.repositories.VotesBoardUserRepository)
		private readonly boardUserRepository: VotesBoardUserRepositoryInterface,
		@Inject(Cards.TYPES.services.GetCardService)
		private getCardService: GetCardServiceInterface
	) {}

	private logger: Logger = new Logger('DeleteVoteService');

	async decrementVoteUser(boardId: string, userId: string, count?: number, withSession?: boolean) {
		const updatedBoardUser = await this.boardUserRepository.findBoardUserByFieldAndUpdate(
			{
				user: userId,
				board: boardId
			},
			{
				$inc: { votesCount: !count ? -1 : count }
			},
			null,
			null,
			withSession
		);

		if (!updatedBoardUser) throw new BadRequestException(UPDATE_FAILED);
	}

	async deleteVoteFromCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	) {
		let retryCount = 0;
		await this.boardUserRepository.startTransaction();
		await this.boardRepository.startTransaction();
		const withSession = true;

		const canUserVote = await this.canUserVote(boardId, userId, count, cardId);

		if (!canUserVote) throw new BadRequestException(DELETE_VOTE_FAILED);
		const card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) throw new BadRequestException(DELETE_VOTE_FAILED);

		const cardItem = card.items.find((item) => item._id.toString() === cardItemId);

		if (!cardItem) throw new BadRequestException(DELETE_VOTE_FAILED);

		let votes = cardItem.votes as unknown as string[];

		const userVotes = votes.filter((vote) => vote.toString() === userId.toString());
		votes = votes.filter((vote) => vote.toString() !== userId.toString());
		userVotes.splice(0, Math.abs(count));
		votes = votes.concat(userVotes);

		try {
			const updatedBoard = await this.setCardItemVotes(
				boardId,
				cardItemId,
				votes,
				cardId,
				withSession
			);
			await this.decrementVoteUser(boardId, userId, count, withSession);

			if (!updatedBoard) throw new BadRequestException(DELETE_VOTE_FAILED);

			await this.boardUserRepository.commitTransaction();
			await this.boardRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			await this.boardUserRepository.abortTransaction();
			await this.boardRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
				retryCount++;
				await this.boardUserRepository.endSession();
				await this.boardRepository.endSession();
				await this.deleteVoteFromCard(boardId, cardId, userId, cardItemId, count);
			} else {
				throw new BadRequestException(DELETE_VOTE_FAILED);
			}
		} finally {
			await this.boardUserRepository.endSession();
			await this.boardRepository.endSession();
		}
	}

	async deleteVoteFromCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		let retryCount = 0;
		await this.boardUserRepository.startTransaction();
		await this.boardRepository.startTransaction();
		const withSession = true;

		const canUserVote = await this.canUserVote(boardId, userId, count, cardId);

		if (!canUserVote) throw new BadRequestException(DELETE_VOTE_FAILED);
		let currentCount = Math.abs(count);
		let card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) throw new BadRequestException(DELETE_VOTE_FAILED);

		const { votes } = card;

		let mappedVotes = votes as unknown as string[];
		const userVotes = mappedVotes.filter((vote) => vote.toString() === userId.toString());

		if (!isEmpty(userVotes)) {
			mappedVotes = mappedVotes.filter((vote) => vote.toString() !== userId.toString());
			const votesToReduce = userVotes.length / currentCount >= 1 ? currentCount : userVotes.length;
			userVotes.splice(0, Math.abs(votesToReduce));

			mappedVotes = mappedVotes.concat(userVotes);

			try {
				await this.decrementVoteUser(boardId, userId, -votesToReduce, withSession);
				const updatedBoard = await this.setCardVotes(boardId, mappedVotes, cardId, withSession);

				if (!updatedBoard) throw new BadRequestException(DELETE_VOTE_FAILED);

				await this.boardUserRepository.commitTransaction();
				await this.boardRepository.commitTransaction();
			} catch (e) {
				this.logger.error(e);
				await this.boardUserRepository.abortTransaction();
				await this.boardRepository.abortTransaction();

				if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
					retryCount++;
					await this.boardUserRepository.endSession();
					await this.boardRepository.endSession();
					await this.deleteVoteFromCardGroup(boardId, cardId, userId, count);
				} else {
					throw new BadRequestException(DELETE_VOTE_FAILED);
				}
			} finally {
				await this.boardUserRepository.endSession();
				await this.boardRepository.endSession();
			}

			currentCount -= Math.abs(votesToReduce);

			if (currentCount === 0) return;
		}

		if (!isEmpty(currentCount)) {
			while (currentCount > 0) {
				card = await this.getCardService.getCardFromBoard(boardId, cardId);

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
	}

	/* #################### HELPERS #################### */

	private async canUserVote(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		cardItemId?: string
	): Promise<boolean> {
		const board = await this.boardRepository.findOneById(boardId);

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		const boardUserFound = await this.boardUserRepository.findOneByFieldWithQuery({
			board: boardId,
			user: userId
		});

		const card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) return false;

		if (cardItemId) {
			const item = card.items.find((item) => item._id === cardItemId);

			if (!arrayIdToString(item.votes as string[]).includes(userId.toString())) {
				return false;
			}
		} else {
			let votes = card.votes as string[];
			card.items.forEach((item) => {
				votes = votes.concat(item.votes as string[]);
			});

			if (!arrayIdToString(votes).includes(userId.toString())) {
				return false;
			}
		}

		return boardUserFound?.votesCount
			? boardUserFound.votesCount > 0 && boardUserFound.votesCount - Math.abs(count) >= 0
			: false;
	}

	private setCardVotes(
		boardId: string,
		mappedVotes: string[],
		cardId: string,
		withSession?: boolean
	): Promise<Board> {
		return this.boardRepository.findBoardByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$set: {
					'columns.$.cards.$[c].votes': mappedVotes
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }]
			},
			null,
			withSession
		);
	}

	private setCardItemVotes(
		boardId: string,
		cardItemId: string,
		votes: string[],
		cardId: string,
		withSession?: boolean
	): Promise<Board> {
		return this.boardRepository.findBoardByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards.items._id': cardItemId
			},
			{
				$set: {
					'columns.$.cards.$[c].items.$[i].votes': votes
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }]
			},
			null,
			withSession
		);
	}
}
