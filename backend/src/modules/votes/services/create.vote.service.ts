import { GetBoardUserServiceInterface } from '../../boardUsers/interfaces/services/get.board.user.service.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BOARD_NOT_FOUND, INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';

@Injectable()
export default class CreateVoteService implements CreateVoteServiceInterface {
	constructor(
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	async canUserVote(boardId: string, userId: string, count: number) {
		const canUserVoteResult = await this.verifyIfUserCanVote(boardId, userId, count);

		if (!canUserVoteResult) throw new InsertFailedException(INSERT_VOTE_FAILED);

		return;
	}

	async incrementVoteUser(boardId: string, userId: string, count: number, withSession?: boolean) {
		const updatedBoardUser = await this.updateBoardUserService.updateVoteUser(
			boardId,
			userId,
			count,
			withSession
		);

		if (!updatedBoardUser) throw new UpdateFailedException();
	}

	/* #################### HELPERS #################### */

	private async verifyIfUserCanVote(
		boardId: string,
		userId: string,
		count: number
	): Promise<boolean> {
		const maxVotesOfBoard = await this.getBoardMaxVotes(boardId);

		if (maxVotesOfBoard === null || maxVotesOfBoard === undefined) {
			return true;
		}

		return this.canBoardUserVote(boardId, userId, count, Number(maxVotesOfBoard));
	}

	private async getBoardMaxVotes(boardId: string) {
		const board = await this.getBoardService.getBoardById(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		return board.maxVotes;
	}

	private async canBoardUserVote(boardId: string, userId: string, count: number, maxVotes: number) {
		const boardUser = await this.getBoardUserService.getBoardUser(boardId, userId);

		if (!boardUser) {
			return false;
		}

		const userCanVote = boardUser.votesCount !== undefined && boardUser.votesCount >= 0;

		return userCanVote ? boardUser.votesCount + count <= maxVotes : false;
	}
}
