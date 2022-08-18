import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UPDATE_FAILED } from 'libs/exceptions/messages';
import Board, { BoardDocument } from 'modules/boards/schemas/board.schema';
import BoardUser, { BoardUserDocument } from 'modules/boards/schemas/board.user.schema';

import { CreateVoteService } from '../interfaces/services/create.vote.service.interface';

@Injectable()
export default class CreateVoteServiceImpl implements CreateVoteService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
	) {}

	private async podeVotarCondicao(boardId: string, userId: string): Promise<boolean> {
		const board = await this.boardModel.findById(boardId).exec();
		if (!board) {
			throw new NotFoundException('Board not found!');
		}
		const maxVotes = board?.maxVotes as Number;
		// myUser
		const myUser = await this.boardUserModel.find({ board: boardId, user: userId });
		const podeVotar = myUser[0].votesCount <= maxVotes;
		const superTeste = maxVotes === null || podeVotar;
		console.log('condicao', superTeste, 'podevotar', podeVotar, myUser[0].votesCount, maxVotes);
		return superTeste;
	}

	async incrementVoteUser(boardId: string, userId: string) {
		// const podeVotarCondicao = await this.podeVotarCondicao(boardId, userId);
		const boardUser = this.boardUserModel
			.findOneAndUpdate(
				{
					user: userId,
					board: boardId
				},
				{
					$inc: { votesCount: 1 }
				}
			)
			.lean()
			.exec();
		if (!boardUser) throw Error(UPDATE_FAILED);
		return boardUser;
	}

	// addVoteToCard(boardId: string, cardId: string, userId: string, cardItemId: string) {
	// 	this.incrementVoteUser(boardId, userId);
	// 	return this.boardModel
	// 		.findOneAndUpdate(
	// 			{
	// 				_id: boardId,
	// 				'columns.cards.items._id': cardItemId
	// 			},
	// 			{
	// 				$push: {
	// 					'columns.$.cards.$[c].items.$[i].votes': userId
	// 				},
	// 				$inc: { totalUsedVotes: 1 }
	// 			},
	// 			{
	// 				arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
	// 				new: true
	// 			}
	// 		)
	// 		.populate({
	// 			path: 'users',
	// 			select: 'user role votesCount -board',
	// 			populate: { path: 'user', select: 'firstName lastName _id' }
	// 		})
	// 		.lean()
	// 		.exec();
	// }

	async addVoteToCard(boardId: string, cardId: string, userId: string, cardItemId: string) {
		const podeVotarCondicao = await this.podeVotarCondicao(boardId, userId);
		if (podeVotarCondicao) {
			await this.incrementVoteUser(boardId, userId);
			console.log('PASSOU2');
			return this.boardModel
				.findOneAndUpdate(
					{
						_id: boardId,
						'columns.cards.items._id': cardItemId
					},
					{
						$push: {
							'columns.$.cards.$[c].items.$[i].votes': userId
						},
						$inc: { totalUsedVotes: 1 }
					},
					{
						arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
						new: true
					}
				)
				.populate({
					path: 'users',
					select: 'user role votesCount -board',
					populate: { path: 'user', select: 'firstName lastName _id' }
				})
				.lean()
				.exec();
		}
		console.log('PAROU2');
		throw new NotFoundException('Vote not found!');
	}
}
