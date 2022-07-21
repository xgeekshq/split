import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, ObjectId } from 'mongoose';

import { TeamRoles } from 'libs/enum/team.roles';
import * as Boards from 'modules/boards/interfaces/types';
import { GetTeamServiceInterface } from 'modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'modules/teams/interfaces/types';
import { TeamUserDocument } from 'modules/teams/schemas/team.user.schema';

import { UpdateBoardDto } from '../dto/update-board.dto';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { UpdateBoardService } from '../interfaces/services/update.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

@Injectable()
export default class UpdateBoardServiceImpl implements UpdateBoardService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(Teams.TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	/**
	 * Method to retrieve user details from team.
	 * This method is used to see if the user is Admin or a Stakeholder
	 *
	 * @param userId Current User Logged
	 * @param teamId Team ID (team from board)
	 * @returns Team User
	 */
	private async getTeamUser(
		userId: string,
		teamId: string
	): Promise<LeanDocument<TeamUserDocument>> {
		const teamUser = await this.getTeamService.getTeamUser(userId, teamId);

		if (!teamUser) {
			throw new NotFoundException('User not found on this team!');
		}

		return teamUser;
	}

	/**
	 * Method to get user from board, if it's responsible
	 * If not, return a null value
	 *
	 * @param userId Current User Logged
	 * @returns Board User
	 */
	private async getResponsible(userId: string): Promise<LeanDocument<BoardUserDocument> | null> {
		const user = await this.boardUserModel.findOne({ user: userId }).lean().exec();

		if (!user) {
			throw new NotFoundException('User not found!');
		}

		if (user.role !== 'responsible') {
			return null;
		}

		return user;
	}

	async update(userId: string, boardId: string, boardData: UpdateBoardDto) {
		const board = await this.boardModel.findById(boardId).exec();

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		// Destructuring board variables
		const { isSubBoard, team, createdBy } = board;

		// Get Team User to see if is Admin or Stakeholder
		const teamUser = await this.getTeamUser(userId, String(team));

		// Role Validation
		const isAdminOrStakeholder = [TeamRoles.STAKEHOLDER, TeamRoles.ADMIN].includes(
			teamUser.role as TeamRoles
		);

		// Get user info to see if is responsible or not
		const subBoardResponsible = await this.getResponsible(userId);

		// Validate if the logged user are the owner
		const isOwner = String(userId) === String(createdBy);

		if (isAdminOrStakeholder || isOwner || (isSubBoard && !!subBoardResponsible)) {
			return this.boardModel
				.findOneAndUpdate(
					{
						_id: boardId
					},
					{
						...boardData,
						maxVotes:
							Number(boardData.maxVotes) < Number(board?.maxVotes) && board?.totalUsedVotes !== 0
								? board?.maxVotes
								: boardData.maxVotes
					},
					{
						new: true
					}
				)
				.lean()
				.exec();
		}

		throw new ForbiddenException('You are not allowed to update this board!');
	}

	async mergeBoards(subBoardId: string, userId: string) {
		const [subBoard, board] = await Promise.all([
			this.boardModel.findById(subBoardId).lean().exec(),
			this.boardModel
				.findOne({ dividedBoards: { $in: [subBoardId] } })
				.lean()
				.exec()
		]);
		if (!subBoard || !board || subBoard.submitedByUser) return null;
		const team = await this.getTeamService.getTeam((board.team as ObjectId).toString());
		if (!team) return null;

		const newSubColumns = this.generateNewSubColumns(subBoard);

		const newColumns = [...board.columns];
		for (let i = 0; i < newColumns.length; i++) {
			newColumns[i].cards = [...newColumns[i].cards, ...newSubColumns[i].cards];
		}

		this.boardModel
			.findOneAndUpdate(
				{
					_id: subBoardId
				},
				{
					$set: {
						submitedByUser: userId,
						submitedAt: new Date()
					}
				}
			)
			.lean()
			.exec();

		return this.boardModel
			.findOneAndUpdate(
				{
					_id: board._id
				},
				{
					$set: { columns: newColumns }
				},
				{ new: true }
			)
			.lean()
			.exec();
	}

	generateNewSubColumns(subBoard: LeanDocument<BoardDocument>) {
		return [...subBoard.columns].map((column) => {
			const newColumn = {
				title: column.title,
				color: column.color,
				cards: column.cards.map((card) => {
					const newCard = {
						text: card.text,
						createdBy: card.createdBy,
						votes: card.votes,
						anonymous: card.anonymous,
						createdByTeam: subBoard.title.replace('board', ''),
						comments: card.comments.map((comment) => {
							return {
								text: comment.text,
								createdBy: comment.createdBy
							};
						}),
						items: card.items.map((cardItem) => {
							return {
								text: cardItem.text,
								votes: cardItem.votes,
								createdByTeam: subBoard.title,
								createdBy: card.createdBy,
								anonymous: cardItem.anonymous,
								comments: cardItem.comments.map((comment) => {
									return {
										text: comment.text,
										createdBy: comment.createdBy
									};
								})
							};
						})
					};
					return newCard;
				})
			};
			return newColumn;
		});
	}
}
