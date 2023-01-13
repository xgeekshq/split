import { ClientSession, Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import CardDto from '../dto/card.dto';
import Card from '../schemas/card.schema';

export const pushCardIntoPosition = async (
	boardId: string,
	columnId: string,
	position: number,
	card: Card | CardDto,
	boardModel: Model<BoardDocument>,
	session?: ClientSession
): Promise<Board> => {
	return boardModel
		.findOneAndUpdate(
			{
				_id: boardId,
				'columns._id': columnId
			},
			{
				$push: {
					'columns.$.cards': {
						$each: [card],
						$position: position
					}
				}
			},
			{ new: true, session }
		)
		.populate([
			{
				path: 'columns.cards.createdBy',
				select: '_id firstName lastName'
			},
			{
				path: 'columns.cards.comments.createdBy',
				select: '_id  firstName lastName'
			},
			{
				path: 'columns.cards.items.createdBy',
				select: '_id firstName lastName'
			},
			{
				path: 'columns.cards.items.comments.createdBy',
				select: '_id firstName lastName'
			}
		])
		.lean()
		.exec();
};
