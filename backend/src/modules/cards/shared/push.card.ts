import { ClientSession, LeanDocument, Model } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';
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
		.populate({
			path: 'users',
			select: 'user role -board votesCount',
			populate: { path: 'user', select: 'firstName email lastName _id' }
		})
		.populate({
			path: 'team',
			select: 'name users -_id',
			populate: {
				path: 'users',
				select: 'user role',
				populate: { path: 'user', select: 'firstName lastName email joinedAt' }
			}
		})
		.populate({
			path: 'columns.cards.createdBy',
			select: '_id firstName lastName'
		})
		.populate({
			path: 'columns.cards.comments.createdBy',
			select: '_id  firstName lastName'
		})
		.populate({
			path: 'columns.cards.items.createdBy',
			select: '_id firstName lastName'
		})
		.populate({
			path: 'columns.cards.items.comments.createdBy',
			select: '_id firstName lastName'
		})
		.populate({
			path: 'createdBy',
			select: '_id firstName lastName isSAdmin joinedAt'
		})
		.populate({
			path: 'dividedBoards',
			select: '-__v -createdAt -id',
			populate: {
				path: 'users',
				select: 'role user'
			}
		})
		.lean()
		.exec();
};
