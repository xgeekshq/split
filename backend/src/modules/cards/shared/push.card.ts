import { ClientSession, LeanDocument, Model } from 'mongoose';

import { BoardDocument } from 'modules/boards/schemas/board.schema';

import CardDto from '../dto/card.dto';
import { CardDocument } from '../schemas/card.schema';

export const pushCardIntoPosition = async (
	boardId: string,
	columnId: string,
	position: number,
	card: LeanDocument<CardDocument> | CardDto,
	boardModel: Model<BoardDocument>,
	session?: ClientSession
) => {
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
		.lean()
		.exec();
};
