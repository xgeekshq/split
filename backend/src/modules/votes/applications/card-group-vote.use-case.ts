import { Inject, Injectable, Logger } from '@nestjs/common';
import { CREATE_VOTE_SERVICE, DELETE_VOTE_SERVICE, VOTE_REPOSITORY } from '../constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { DELETE_VOTE_FAILED, INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import CardGroupVoteUseCaseDto from '../dto/useCase/card-group-vote.use-case.dto';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import isEmpty from 'src/libs/utils/isEmpty';
import Card from 'src/modules/cards/entities/card.schema';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { arrayIdToString } from 'src/libs/utils/arrayIdToString';
import { getVotesFromCardItem } from '../utils/getVotesFromCardItem';
import { UPDATE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

@Injectable()
export class CardGroupVoteUseCase implements UseCase<CardGroupVoteUseCaseDto, void> {
	private logger: Logger = new Logger('CreateVoteService');
	constructor(
		@Inject(CREATE_VOTE_SERVICE)
		private readonly createVoteService: CreateVoteServiceInterface,
		@Inject(VOTE_REPOSITORY)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(UPDATE_BOARD_USER_SERVICE)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(DELETE_VOTE_SERVICE)
		private readonly deleteVoteService: DeleteVoteServiceInterface
	) {}

	async execute({ boardId, cardId, userId, count, completionHandler }: CardGroupVoteUseCaseDto) {
		if (count < 0) {
			await this.deleteVoteFromCardGroup(boardId, cardId, userId, count);
		} else {
			await this.addVoteToCardGroupAndUser(boardId, userId, count, cardId);
		}

		completionHandler();
	}

	private async addVoteToCardGroupAndUser(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		retryCount?: number
	) {
		await this.createVoteService.canUserVote(boardId, userId, count);

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		try {
			await this.addVoteToCardGroupAndUserOperations(boardId, userId, count, cardId, retryCount);
			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			throw new InsertFailedException(INSERT_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	private async addVoteToCardGroupAndUserOperations(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		retryCount?: number
	) {
		let retryCountOperation = retryCount ?? 0;
		const withSession = true;
		try {
			await this.createVoteService.incrementVoteUser(boardId, userId, count, withSession);
			const updatedBoard = await this.voteRepository.insertCardGroupVote(
				boardId,
				userId,
				count,
				cardId,
				withSession
			);

			if (!updatedBoard) throw new InsertFailedException(INSERT_VOTE_FAILED);
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.addVoteToCardGroupAndUser(boardId, userId, count, cardId, retryCountOperation);
			} else {
				throw new InsertFailedException(INSERT_VOTE_FAILED);
			}
		}
	}

	private async deleteVoteFromCardGroup(
		boardId: string,
		cardId: string,
		userId: string,
		count: number,
		retryCount?: number
	) {
		await this.deleteVoteService.canUserDeleteVote(boardId, userId, count, cardId);

		let currentCount = Math.abs(count);

		const card = await this.deleteVoteService.getCardFromBoard(boardId, cardId);

		const mappedVotes = card.votes as string[];

		const userVotes = mappedVotes.filter((vote) => vote.toString() === userId.toString());

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		try {
			const withSession = true;

			if (!isEmpty(userVotes)) {
				currentCount = await this.deleteCardGroupAndUserVotes(
					mappedVotes,
					userVotes,
					boardId,
					cardId,
					userId,
					count,
					currentCount,
					withSession,
					retryCount
				);
			}

			if (!isEmpty(currentCount)) {
				await this.deleteCardItemAndUserVotes(
					currentCount,
					boardId,
					card,
					userId,
					withSession,
					retryCount
				);
			}
			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			throw new DeleteFailedException(DELETE_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	private async deleteCardItemAndUserVotes(
		currentCount: number,
		boardId: string,
		card: Card,
		userId: string,
		withSession: boolean,
		retryCount?: number
	) {
		let items = card.items;

		while (currentCount > 0) {
			const item = items.find(({ votes: itemVotes }) =>
				arrayIdToString(itemVotes as string[]).includes(userId.toString())
			);

			if (!item) {
				throw new DeleteFailedException(DELETE_VOTE_FAILED);
			}

			const votesOfUser = (item.votes as string[]).filter(
				(vote) => vote.toString() === userId.toString()
			);

			const itemVotesToReduce =
				votesOfUser.length / currentCount >= 1 ? currentCount : votesOfUser.length;

			await this.deleteVoteFromCardItemOnCardGroup(
				boardId,
				card._id,
				userId,
				String(item._id),
				-itemVotesToReduce,
				withSession,
				retryCount
			);

			currentCount -= itemVotesToReduce;
			items = items.filter((card) => String(card._id) !== String(item._id));
		}
	}

	private async deleteVoteFromCardItemOnCardGroup(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number,
		withSession: boolean,
		retryCount?: number
	) {
		const cardItem = await this.deleteVoteService.getCardItemFromBoard(boardId, cardId, cardItemId);

		const votes = getVotesFromCardItem(cardItem.votes as string[], String(userId), count);

		let retryCountOperation = retryCount ?? 0;

		try {
			await this.deleteVoteService.removeVotesFromCardItem(
				boardId,
				cardItemId,
				votes,
				cardId,
				withSession
			);
			await this.deleteVoteService.decrementVoteUser(boardId, userId, count, withSession);
		} catch (e) {
			this.logger.error(e);

			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();

				await this.deleteVoteFromCardGroup(boardId, cardId, userId, count, retryCountOperation);
			} else {
				throw new DeleteFailedException(DELETE_VOTE_FAILED);
			}
		}
	}

	private async deleteCardGroupAndUserVotes(
		votes: string[],
		userVotes: string[],
		boardId: string,
		cardId: string,
		userId: string,
		count: number,
		currentCount: number,
		withSession: boolean,
		retryCount?: number
	) {
		let mappedVotes = votes.filter((vote) => vote.toString() !== userId.toString());

		const votesToReduce = userVotes.length / currentCount >= 1 ? currentCount : userVotes.length;

		userVotes.splice(0, Math.abs(votesToReduce));

		mappedVotes = mappedVotes.concat(userVotes);

		let retryCountOperation = retryCount ?? 0;

		try {
			await this.removeVotesFromCardGroup(boardId, mappedVotes, cardId, withSession);
			await this.deleteVoteService.decrementVoteUser(boardId, userId, -votesToReduce, withSession);

			currentCount -= Math.abs(votesToReduce);

			if (currentCount === 0) return;

			return currentCount;
		} catch (e) {
			this.logger.error('error', e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.deleteVoteFromCardGroup(boardId, cardId, userId, count, retryCountOperation);
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
}
