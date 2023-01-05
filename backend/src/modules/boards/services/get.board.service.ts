import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { LeanDocument, Model } from 'mongoose';
import { BOARDS_NOT_FOUND } from 'src/libs/exceptions/messages';
import { boardVotesIdHidden } from 'src/libs/utils/boardVotesIdHidden';
import { hideText } from 'src/libs/utils/hideText';
import { CardItemDocument } from 'src/modules/cards/schemas/card.item.schema';
import { CardDocument } from 'src/modules/cards/schemas/card.schema';
import { CommentDocument } from 'src/modules/comments/schemas/comment.schema';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Team from 'src/modules/teams/interfaces/types';
import { UserDocument } from 'src/modules/users/entities/user.schema';
import { QueryType } from '../interfaces/findQuery';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		@Inject(forwardRef(() => Team.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface
	) {}

	private readonly logger = new Logger(GetBoardServiceImpl.name);

	getAllBoardsIdsOfUser(userId: string) {
		return this.boardModel.find({ user: userId }).select('board').lean().exec();
	}

	async getAllBoardIdsAndTeamIdsOfUser(userId: string) {
		const [boardIds, teamIds] = await Promise.all([
			this.getAllBoardsIdsOfUser(userId),
			this.getTeamService.getTeamsOfUser(userId)
		]);

		return { boardIds, teamIds: teamIds.map((team) => team._id) };
	}

	async getUserBoardsOfLast3Months(userId: string, page: number, size?: number) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const now = new Date();
		const last3Months = new Date().setMonth(now.getMonth() - 3);
		const query = {
			$and: [
				{ isSubBoard: false, updatedAt: { $gte: last3Months } },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		};

		return this.getBoards(false, query, page, size);
	}

	async getSuperAdminBoards(userId: string, page: number, size?: number) {
		const { boardIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [{ isSubBoard: false }, { $or: [{ _id: { $in: boardIds } }, { team: { $ne: null } }] }]
		};

		return this.getBoards(true, query, page, size);
	}

	async getUsersBoards(userId: string, page: number, size?: number) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [
				{ isSubBoard: false },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		};

		return this.getBoards(false, query, page, size);
	}

	getTeamBoards(teamId: string, page: number, size?: number) {
		const query = {
			$and: [{ isSubBoard: false }, { $or: [{ team: teamId }] }]
		};

		return this.getBoards(false, query, page, size);
	}

	async getPersonalUserBoards(userId: string, page: number, size?: number) {
		const { boardIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [{ isSubBoard: false }, { $or: [{ _id: { $in: boardIds } }, { team: { $type: 10 } }] }] //`$type: 10` means team is null
		};

		return this.getBoards(false, query, page, size);
	}

	async getBoards(allBoards: boolean, query: QueryType, page = 0, size = 10) {
		const count = await this.boardModel.find(query).countDocuments().exec();
		const hasNextPage = page + 1 < Math.ceil(count / (allBoards ? count : size));
		try {
			const boards = await this.boardModel
				.find(query)
				.sort({ updatedAt: 'desc' })
				.skip(allBoards ? 0 : page * size)
				.limit(allBoards ? count : size)
				.select('-__v -createdAt -id')
				.populate({ path: 'createdBy', select: 'firstName lastName' })
				.populate({
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
				})
				.populate({
					path: 'dividedBoards',
					select: '-__v -createdAt -id',
					populate: [
						{
							path: 'users',
							select: 'role user',
							populate: {
								path: 'user',
								model: 'User',
								select: 'firstName email lastName joinedAt'
							}
						},
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
						}
					]
				})
				.populate({
					path: 'users',
					select: 'user role -board',
					populate: {
						path: 'user',
						select: 'firstName email lastName joinedAt'
					}
				})
				.lean({ virtuals: true })
				.exec();

			return { boards: boards ?? [], hasNextPage, page };
		} catch (e) {
			this.logger.error(BOARDS_NOT_FOUND);
		}

		return { boards: [], hasNextPage, page };
	}

	getBoardFromRepo(boardId: string) {
		return this.boardModel.findById(boardId).lean().exec();
	}

	async getMainBoardData(boardId: string) {
		const mainBoard = await this.boardModel
			.findOne({ dividedBoards: { $in: boardId } })
			.select('dividedBoards team title')
			.populate({
				path: 'dividedBoards',
				select: '_id title'
			})
			.populate({
				path: 'team',
				select: 'name users _id',
				populate: {
					path: 'users',
					select: 'user role',
					populate: {
						path: 'user',
						select: 'firstName email lastName joinedAt'
					}
				}
			})
			.lean({ virtuals: true })
			.exec();

		return mainBoard;
	}

	async getBoard(boardId: string, userId: string) {
		let board = await this.getBoardData(boardId);

		if (!board) return null;

		// board1 = this.commentsClean(b)
		board = this.cleanBoard(board, userId);

		if (board.isSubBoard) {
			const mainBoard = await this.getMainBoardData(boardId);

			if (!mainBoard) return null;

			return { board, mainBoardData: mainBoard };
		}

		return { board };
	}

	/**
	 * Filter an array of votes and return only the votes from current user
	 * @param input Array of Votes
	 * @param userId Current Logged User
	 * @returns Array of Votes (filtered)
	 */
	private filterVotes(input: LeanDocument<CardDocument | CardItemDocument>, userId: string) {
		return (input.votes as UserDocument[]).filter((vote) => String(vote._id) === String(userId));
	}

	/**
	 * Replace user name (first and last) by "a"
	 * @param input Card or a Card Item
	 * @param userId current logged user
	 * @param anonymous boolean to used when card is anonymous
	 * @returns Created By User with first/last name replaced by "a"
	 */
	private replaceUser(input: UserDocument, userId: string): LeanDocument<UserDocument> {
		return {
			...input,
			_id: String(userId) === String(input._id) ? input._id : undefined,
			firstName: hideText(input.firstName),
			lastName: hideText(input.lastName)
		};
	}

	/**
	 * Replace comments from other users
	 * @param input array of comments
	 * @param userId current logged user
	 * @returns array of comments
	 */
	private replaceComments(
		hideCards: boolean,
		createdByAsUserDocument: UserDocument,
		input: LeanDocument<CommentDocument[]>,
		userId: string
	): LeanDocument<CommentDocument[]> {
		return input.map((comment) => {
			const { anonymous, text } = comment;

			if (anonymous) {
				return {
					...comment,
					createdBy: this.replaceUser(comment.createdBy as UserDocument, userId)
				};
			}

			if (hideCards && String(createdByAsUserDocument._id) !== String(userId)) {
				return {
					...comment,
					createdBy: this.replaceUser(comment.createdBy as UserDocument, userId),
					text: hideText(text)
				};
			}

			return { ...comment };
		});
	}

	/**
	 * Replace card from other users, using the methods created before
	 * @param input Card or a Card Item
	 * @param userId current logged user
	 * @param hideCards option from database
	 * @param hideVotes option from database
	 * @returns Card or a Card Item
	 */
	private replaceCard(
		input: LeanDocument<CardDocument | CardItemDocument>,
		userId: string,
		hideCards: boolean,
		hideVotes: boolean
	): LeanDocument<CardDocument | CardItemDocument> {
		let { text, comments, votes, createdBy } = input;
		const { anonymous } = input;
		const createdByAsUserDocument = createdBy as UserDocument;

		if (hideCards && String(createdByAsUserDocument._id) !== String(userId)) {
			text = hideText(input.text);
			createdBy = this.replaceUser(createdByAsUserDocument, userId);
		}

		if (comments?.length > 0) {
			comments = this.replaceComments(hideCards, createdByAsUserDocument, input.comments, userId);
		}

		if (anonymous) {
			createdBy = this.replaceUser(createdByAsUserDocument, userId);
		}

		if (hideVotes) {
			votes = this.filterVotes(input, userId);
		}

		return {
			...input,
			text,
			votes,
			comments,
			createdBy
		};
	}

	/**
	 * Method to (if flags are true) replace cards/comments or hide votes
	 * @param input Board
	 * @param userId Current Logged User
	 * @returns Board
	 */
	private cleanBoard(
		input: LeanDocument<
			Board & {
				_id: ObjectId;
			}
		>,
		userId: string
	): LeanDocument<
		Board & {
			_id: ObjectId;
		}
	> {
		const { hideCards = false, hideVotes = false, columns: boardColumns } = input;
		// Columns
		input.columns = boardColumns.map((column) => {
			const cards = column.cards.map((card) => {
				const items = card.items.map((item) => {
					return this.replaceCard(item, userId, hideCards, hideVotes);
				});

				return {
					...this.replaceCard(card, userId, hideCards, hideVotes),
					items
				};
			});

			return {
				...column,
				cards
			};
		});

		return boardVotesIdHidden(input, userId) as LeanDocument<Board & { _id: ObjectId }>;
	}

	async countBoards(userId: string) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		return this.boardModel.countDocuments({
			$and: [
				{ isSubBoard: false },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		});
	}

	private async getBoardData(boardId: string) {
		const board = await this.boardModel
			.findById(boardId)
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
			.lean({ virtuals: true })
			.exec();

		return board;
	}

	getAllBoardsByTeamId(teamId: string) {
		return this.boardModel.find({ team: teamId }).select('board').lean().exec();
	}
}
