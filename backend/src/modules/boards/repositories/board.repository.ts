import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { QueryType } from '../interfaces/findQuery';
import { BoardDataPopulate, GetBoardDataPopulate } from '../utils/populate-board';
import { BoardRepositoryInterface } from './board.repository.interface';

@Injectable()
export class BoardRepository
	extends MongoGenericRepository<Board>
	implements BoardRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}

	/* Get Boards */

	getBoard(boardId: string): Promise<Board> {
		return this.findOneById(boardId);
	}

	getBoardPopulated(boardId: string) {
		return this.findOneById(boardId, {}, BoardDataPopulate);
	}

	getMainBoard(boardId: string) {
		return this.findOneByField({ dividedBoards: { $in: boardId } }, 'title');
	}

	getBoardData(boardId: string) {
		return this.findOneById(
			boardId,
			'-slackEnable -slackChannelId -recurrent -__v',
			GetBoardDataPopulate
		);
	}

	getAllBoardsByTeamId(teamId: string) {
		return this.findAllWithQuery({ team: teamId }, 'board', undefined, false);
	}

	countBoards(boardIds: string[] | ObjectId[], teamIds: string[]) {
		return this.model
			.countDocuments({
				$and: [
					{ isSubBoard: false },
					{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
				]
			})
			.exec();
	}

	getCountPage(query: QueryType) {
		return this.model.find(query).countDocuments().exec();
	}

	getAllBoards(allBoards: boolean, query: QueryType, page: number, size: number, count: number) {
		const boardDataToPopulate: PopulateOptions[] = [
			{ path: 'createdBy', select: 'firstName lastName' },
			{
				path: 'team',
				select: 'name users _id',
				populate: {
					path: 'users',
					select: 'user role',
					populate: {
						path: 'user',
						select: '_id firstName lastName joinedAt'
					}
				}
			},
			{
				path: 'dividedBoards',
				select:
					'-__v -createdAt -slackEnable -slackChannelId -submitedAt -id -columns.id -submitedByUser -columns._id -columns.cards.text -columns.cards.createdBy -columns.cards.items.text -columns.cards.items.createdBy -columns.cards.createdAt -columns.cards.items.createdAt -columns.cards._id -columns.cards.id -columns.cards.items._id -columns.cards.items.id -columns.cards.createdByTeam -columns.cards.items.createdByTeam -columns.cards.items.votes -columns.cards.items.comments -columns.cards.votes -columns.cards.comments',
				populate: [
					{
						path: 'users',
						select: 'role user',
						populate: {
							path: 'user',
							model: 'User',
							select: 'firstName email lastName'
						}
					}
				]
			},
			{
				path: 'users',
				select: 'user role -board',
				populate: {
					path: 'user',
					select: '_id firstName email lastName isAnonymous'
				}
			}
		];

		return this.model
			.find(query)
			.sort({ updatedAt: 'desc' })
			.skip(allBoards ? 0 : page * size)
			.limit(allBoards ? count : size)
			.select(
				'-__v -createdAt -slackEnable -slackChannelId -submitedByUser -submitedAt -columns.id -columns._id -columns.cards.text -columns.cards.createdBy -columns.cards.items.text -columns.cards.items.createdBy -columns.cards.createdAt -columns.cards.items.createdAt -columns.cards._id -columns.cards.id -columns.cards.items._id -columns.cards.items.id -columns.cards.createdByTeam -columns.cards.items.createdByTeam -columns.cards.items.votes -columns.cards.items.comments -columns.cards.votes -columns.cards.comments'
			)
			.populate(boardDataToPopulate)
			.lean({ virtuals: true })
			.exec() as unknown as Promise<Board[]>;
	}

	/* Delete Boards */

	deleteManySubBoards(dividedBoards: Board[] | ObjectId[], withSession: boolean): Promise<number> {
		return this.deleteMany({ _id: { $in: dividedBoards } }, withSession);
	}

	deleteBoard(boardId: string, withSession: boolean) {
		return this.findOneAndRemove(boardId, withSession);
	}
}
