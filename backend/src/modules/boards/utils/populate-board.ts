import { PopulateOptions } from 'mongoose';

export const BoardDataPopulate: PopulateOptions[] = [
	{
		path: 'users',
		select: 'user role -board votesCount',
		populate: { path: 'user', select: 'firstName email lastName _id isAnonymous' }
	},
	{
		path: 'team',
		select: 'name users -_id',
		populate: {
			path: 'users',
			select: 'user role',
			populate: { path: 'user', select: 'firstName lastName email joinedAt' }
		}
	},
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
	},
	{
		path: 'createdBy',
		select: '_id firstName lastName isSAdmin joinedAt'
	},
	{
		path: 'dividedBoards',
		select: '-__v -createdAt -id',
		populate: {
			path: 'users',
			select: 'role user'
		}
	}
];

export const GetBoardDataPopulate: PopulateOptions[] = [
	{
		path: 'users',
		select: 'user role -board votesCount',
		populate: { path: 'user', select: 'firstName email lastName _id isAnonymous' }
	},
	{
		path: 'team',
		select: 'name users -_id',
		populate: {
			path: 'users',
			select: 'user role -_id',
			populate: { path: 'user', select: 'firstName lastName email' }
		}
	},
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
	},
	{
		path: 'createdBy',
		select: '_id firstName lastName'
	},
	{
		path: 'dividedBoards',
		select: 'title _id submitedAt'
	}
];
