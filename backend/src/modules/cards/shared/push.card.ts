import { ClientSession, Model } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';
import CardDto from '../dto/card.dto';
import Card from '../entities/card.schema';

export const pushCardIntoPosition = async (
	boardId: string,
	columnId: string,
	position: number,
	card: Card | CardDto,
	boardModel: Model<BoardDocument>,
	session?: ClientSession
) => {
	return boardModel.findOneAndUpdate(
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
	);
};
