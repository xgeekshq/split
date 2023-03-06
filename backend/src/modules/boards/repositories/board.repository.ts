import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { GetBoardDataPopulate } from '../utils/populate-board';
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

	updatePhase(boardId: string, phase: BoardPhases): Promise<Board> {
		const getValues = () => {
			if (phase === BoardPhases.ADDCARDS) {
				return { phase, submitedAt: null };
			} else {
				return {
					phase,
					submitedAt: phase === BoardPhases.VOTINGPHASE ? null : new Date(),
					hideCards: false,
					hideVotes: false,
					addCards: false
				};
			}
		};

		return this.findOneByFieldAndUpdate(
			{
				_id: boardId
			},
			{
				$set: getValues()
			},
			{ new: true },
			GetBoardDataPopulate
		);
	}
}
