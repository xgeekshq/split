import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, ObjectId } from 'mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import Column from 'src/modules/columns/entities/column.schema';
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

	/* GET BOARD */
	getBoard(boardId: string): Promise<Board> {
		return this.findOneById(boardId);
	}

	getAllMainBoards(): Promise<Board[]> {
		return this.findAllWithQuery(
			{
				$and: [{ isSubBoard: false }]
			},
			null,
			'team'
		);
	}

	getBoardPopulated(boardId: string) {
		return this.findOneById(boardId, {}, BoardDataPopulate);
	}

	getMainBoard(boardId: string) {
		return this.findOneByFieldWithQuery({ dividedBoards: { $in: boardId } }, 'title');
	}

	getMainBoardOfSubBoard(boardId: string) {
		return this.findOneByFieldWithQuery({ dividedBoards: { $in: boardId } }, '_id');
	}

	getBoardByQuery<T>(query: FilterQuery<T>) {
		return this.findOneByFieldWithQuery(query);
	}

	getBoardData(boardId: string) {
		return this.findOneById(
			boardId,
			'-slackEnable -slackChannelId -recurrent -__v',
			GetBoardDataPopulate
		);
	}

	getAllBoardsByTeamId(teamId: string) {
		return this.findAllWithQuery({ team: teamId }, null, 'board', undefined, false);
	}

	getCountPage(query: QueryType) {
		return this.countDocumentsWithQuery(query);
	}

	getAllBoards(allBoards: boolean, query: QueryType, page: number, size: number, count: number) {
		const selectDividedBoards =
			'-__v -createdAt -slackEnable -slackChannelId -submitedByUser -submitedAt -columns.id -columns._id -columns.cards.text -columns.cards.createdBy -columns.cards.items.text -columns.cards.items.createdBy -columns.cards.createdAt -columns.cards.items.createdAt -columns.cards._id -columns.cards.id -columns.cards.items._id -columns.cards.items.id -columns.cards.createdByTeam -columns.cards.items.createdByTeam -columns.cards.items.votes -columns.cards.items.comments -columns.cards.votes -columns.cards.comments';
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
				select: selectDividedBoards,
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
			.select(selectDividedBoards)
			.populate(boardDataToPopulate)
			.lean({ virtuals: true })
			.exec() as unknown as Promise<Board[]>;
	}

	getResponsiblesSlackId(boardId: string) {
		return this.findOneByFieldWithQuery({ dividedBoards: { $in: [boardId] } }, 'slackChannelId');
	}

	countBoards(boardIds: (string | ObjectId)[], teamIds: string[]) {
		return this.countDocumentsWithQuery({
			$and: [
				{ isSubBoard: false },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		});
	}

	/* UPDATE BOARDS */
	updateBoard(boardId: string, board: Board, isNew: boolean) {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId
			},
			{
				...board
			},
			{
				new: isNew
			}
		);
	}

	updateMergedSubBoard(subBoardId: string, userId: string, withSession: boolean) {
		return this.findOneByFieldAndUpdate(
			{
				_id: subBoardId
			},
			{
				$set: {
					submitedByUser: userId,
					submitedAt: new Date()
				}
			},
			null,
			null,
			withSession
		);
	}

	updateMergedBoard(boardId: string, newColumns: Column[], withSession: boolean) {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId
			},
			{
				$set: { columns: newColumns }
			},
			{ new: true },
			{
				path: 'dividedBoards',
				select: 'submitedByUser'
			},
			withSession
		);
	}

	updatedChannelId(boardId: string, channelId: string) {
		return this.findOneByFieldAndUpdate({ _id: boardId }, { slackChannelId: channelId });
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

	/* DELETE BOARD */
	deleteManySubBoards(
		dividedBoards: Board[] | ObjectId[] | string[],
		withSession: boolean
	): Promise<number> {
		return this.deleteMany({ _id: { $in: dividedBoards } }, withSession);
	}

	deleteBoard(boardId: string, withSession: boolean) {
		return this.findOneAndRemove(boardId, withSession);
	}
}
