import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardRepositoryInterface } from './board.repository.interface';

@Injectable()
export class BoardRepository
	extends MongoGenericRepository<Board>
	implements BoardRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}
	getBoard(boardId: string): Promise<Board> {
		return this.findOneById(boardId);
	}
	updatePhase(boardId, phase): Promise<Board> {
		const submitedAt = phase !== BoardPhases.SUBMITED ? null : new Date();

		return this.findOneByFieldAndUpdate(
			{
				_id: boardId
			},
			{
				$set: {
					phase,
					submitedAt
				}
			},
			{ new: true },
			{
				path: 'team',
				select: 'name -_id'
			}
		);
	}
}
