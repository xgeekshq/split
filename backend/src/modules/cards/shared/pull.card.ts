import { UpdateResult } from 'mongodb';
import { ClientSession, Model } from 'mongoose';

import { BoardDocument } from 'modules/boards/schemas/board.schema';

export const pullCard = (
	boardId: string,
	cardId: string,
	boardModel: Model<BoardDocument>,
	session?: ClientSession
): Promise<UpdateResult> => {
	return boardModel
		.updateOne(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$pull: {
					'columns.$[].cards': { _id: cardId }
				}
			},
			{ session }
		)
		.lean()
		.exec();
};

export const pullItem = (
	boardId: string,
	itemId: string,
	boardModel: Model<BoardDocument>,
	session?: ClientSession
): Promise<UpdateResult> => {
	return boardModel
		.updateOne(
			{
				_id: boardId,
				'columns.cards.items._id': itemId
			},
			{
				$pull: {
					'columns.$[].cards.$[].items': { _id: itemId }
				}
			},
			{ new: true, session }
		)
		.lean()
		.exec();
};
