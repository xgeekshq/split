import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';

@Injectable()
export class VoteRepository
	extends MongoGenericRepository<Board>
	implements VoteRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}

	/* UPDATE VOTES ON BOARD */
	findBoardByFieldAndUpdate(
		value: FilterQuery<Board>,
		query: UpdateQuery<Board>,
		options?: QueryOptions<Board>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(value, query, options, populate, withSession);
	}

	insertCardItemVote(
		boardId: string,
		cardId: string,
		cardItemId: string,
		votes: string[],
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards.items._id': cardItemId
			},
			{
				$push: {
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

	insertCardGroupVote(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$push: {
					'columns.$.cards.$[c].votes': Array(count).fill(userId)
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }]
			},
			null,
			withSession
		);
	}

	removeVotesFromCardItem(
		boardId: string,
		cardId: string,
		cardItemId: string,
		votes: string[],
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
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

	removeVotesFromCard(
		boardId: string,
		mappedVotes: string[],
		cardId: string,
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
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
}
