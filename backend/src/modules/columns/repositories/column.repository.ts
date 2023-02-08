import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate } from 'src/modules/boards/utils/populate-board';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ColumnRepositoryInterface } from './column.repository.interface';

@Injectable()
export class ColumnRepository
	extends MongoGenericRepository<Board>
	implements ColumnRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}

	updateColumn(boardId: string, column: UpdateColumnDto): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns._id': column._id
			},
			{
				$set: {
					'columns.$[column].color': column.color,
					'columns.$[column].title': column.title,
					'columns.$[column].cardText': column.cardText,
					'columns.$[column].isDefaultText': column.isDefaultText
				}
			},
			{
				arrayFilters: [{ 'column._id': column._id }],
				new: true
			},
			BoardDataPopulate
		);
	}
}
