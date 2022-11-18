import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, ObjectId } from 'mongoose';

import { BoardRoles } from 'libs/enum/board.roles';
import { TeamRoles } from 'libs/enum/team.roles';
import { UPDATE_FAILED } from 'libs/exceptions/messages';
import { getIdFromObjectId } from 'libs/utils/getIdFromObjectId';
import isEmpty from 'libs/utils/isEmpty';
import { TeamDto } from 'modules/communication/dto/team.dto';
import { CommunicationServiceInterface } from 'modules/communication/interfaces/slack-communication.service.interface';
import * as CommunicationsType from 'modules/communication/interfaces/types';
import { GetTeamServiceInterface } from 'modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'modules/teams/interfaces/types';
import { TeamUserDocument } from 'modules/teams/schemas/team.user.schema';
import User, { UserDocument } from 'modules/users/schemas/user.schema';

import { UpdateBoardDto } from '../dto/update-board.dto';
import { ResponsibleType } from '../interfaces/responsible.interface';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

@Injectable()
export default class UpdateBoardServiceImpl implements UpdateBoardServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(Teams.TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface,
		@Inject(CommunicationsType.TYPES.services.SlackCommunicationService)
		private slackCommunicationService: CommunicationServiceInterface,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
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
	 * @param boardId Board Id
	 * @returns Board User
	 */
	private async isUserResponsible(userId: string, boardId: string): Promise<boolean> {
		const user = await this.boardUserModel
			.findOne({ user: userId, board: boardId, role: BoardRoles.RESPONSIBLE })
			.lean()
			.exec();

		return !!user;
	}

	/**
	 * Method to get current responsible to a specific board
	 * @param boardId String
	 * @return Board User
	 * @private
	 */
	private async getBoardResponsibleInfo(boardId: string): Promise<ResponsibleType | undefined> {
		const boardUser = await this.boardUserModel
			.findOne({ board: boardId, role: BoardRoles.RESPONSIBLE })
			.populate({ path: 'user' })
			.exec();

		if (!boardUser) {
			return undefined;
		}

		const user = boardUser?.user as UserDocument;

		return { id: user._id, email: user.email };
	}

	/**
	 * Method to get the highest value of votesCount on Board Users
	 * @param boardId String
	 * @return number
	 */
	private async getHighestVotesOnBoard(boardId: string): Promise<number> {
		const votesCount = await this.boardUserModel.find({ board: boardId }, ['votesCount']);

		return votesCount.reduce(
			(prev, current) => (current.votesCount > prev ? current.votesCount : prev),
			0
		);
	}

	async update(userId: string, boardId: string, boardData: UpdateBoardDto) {
		const board = await this.boardModel.findById(boardId).exec();

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		// Destructuring board variables
		const { team, createdBy, isSubBoard } = board;

		// Get Team User to see if is Admin or Stakeholder
		const teamUser = await this.getTeamUser(userId, String(team));

		// Role Validation
		const isAdminOrStakeholder = [TeamRoles.STAKEHOLDER, TeamRoles.ADMIN].includes(
			teamUser.role as TeamRoles
		);

		// Get user info to see if is responsible or not
		const isSubBoardResponsible = await this.isUserResponsible(userId, boardId);

		// Validate if the logged user are the owner
		const isOwner = String(userId) === String(createdBy);

		const currentResponsible = await this.getBoardResponsibleInfo(boardId);
		const newResponsible: ResponsibleType = { id: currentResponsible?.id, email: '' };

		if (isAdminOrStakeholder || isOwner || (isSubBoard && isSubBoardResponsible)) {
			/**
			 * Validate if:
			 * - have users on request
			 * - is a sub-board
			 * - and the logged user isn't the current responsible
			 */
			if (isSubBoard && boardData.users) {
				const boardUserFound = boardData.users.find(
					(userFound) => userFound.role === BoardRoles.RESPONSIBLE
				) as unknown as LeanDocument<BoardUserDocument>;
				newResponsible.email = (boardUserFound.user as User).email;
				newResponsible.id = (boardUserFound.user as unknown as LeanDocument<BoardUserDocument>)._id;

				boardData.users
					.filter((boardUser) =>
						[getIdFromObjectId(String(currentResponsible?.id)), newResponsible.id].includes(
							(boardUser.user as unknown as LeanDocument<UserDocument>)._id
						)
					)
					.map(async (boardUser) => {
						const typedBoardUser = boardUser.user as unknown as LeanDocument<BoardUserDocument>;
						try {
							await this.boardUserModel.findOneAndUpdate(
								{
									user: typedBoardUser._id,
									board: boardId
								},
								{
									role: boardUser.role
								}
							);
						} catch {
							throw new BadRequestException(UPDATE_FAILED);
						}
					});
			}

			/**
			 * Only can change the maxVotes if:
			 * - new maxVotes not empty
			 * - current highest votes equals to zero
			 * - or current highest votes lower than new maxVotes
			 */

			if (!isEmpty(boardData.maxVotes)) {
				const highestVotes = await this.getHighestVotesOnBoard(boardId);

				// TODO: maxVotes as 'undefined' not undefined (so typeof returns string, but needs to be number or undefined)
				if (highestVotes > Number(boardData.maxVotes)) {
					throw new BadRequestException(
						`You can't set a lower value to max votes. Please insert a value higher or equals than ${highestVotes}!`
					);
				}
			}

			const updatedBoard = await this.boardModel
				.findOneAndUpdate(
					{
						_id: boardId
					},
					{
						...boardData
					},
					{
						new: true
					}
				)
				.lean()
				.exec();

			if (
				updatedBoard &&
				String(currentResponsible?.id) !== newResponsible.id &&
				board.slackChannelId
			) {
				this.handleResponsibleSlackMessage(
					newResponsible,
					currentResponsible,
					board._id,
					board.title,
					board.slackChannelId
				);
			}

			return updatedBoard;
		}

		throw new ForbiddenException('You are not allowed to update this board!');
	}

	private async handleResponsibleSlackMessage(
		newResponsible: ResponsibleType,
		currentResponsible: ResponsibleType | undefined,
		boardId: string,
		boardTitle: string,
		slackChannelId: string
	) {
		this.slackCommunicationService.executeResponsibleChange({
			newResponsibleEmail: newResponsible.email,
			previousResponsibleEmail: currentResponsible?.email ?? '',
			subTeamChannelId: slackChannelId,
			responsiblesChannelId: (await this.boardModel.findOne({ dividedBoards: { $in: [boardId] } }))
				?.slackChannelId,
			teamNumber: Number(boardTitle[boardTitle.length - 1]),
			email: newResponsible.email
		});
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

		const result = this.boardModel
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

		if (board.slackChannelId) {
			this.slackCommunicationService.executeMergeBoardNotification({
				responsiblesChannelId: board.slackChannelId,
				teamNumber: subBoard.boardNumber,
				isLastSubBoard: await this.checkIfIsLastBoardToMerge(board._id),
				boardId: subBoardId,
				mainBoardId: board._id
			});
		}

		return result;
	}

	private async checkIfIsLastBoardToMerge(mainBoardId: string): Promise<boolean> {
		const board = await this.boardModel.findById(mainBoardId).populate({ path: 'dividedBoards' });
		if (!board) return false;

		const count = (board.dividedBoards as Board[]).reduce((prev, currentValue) => {
			if (currentValue.submitedByUser) {
				prev -= 1;
				return prev;
			}

			return prev;
		}, board?.dividedBoards.length ?? 0);

		return count === 0;
	}

	private generateNewSubColumns(subBoard: LeanDocument<BoardDocument>) {
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
								createdBy: comment.createdBy,
								anonymous: comment.anonymous
							};
						}),
						items: card.items.map((cardItem) => {
							return {
								text: cardItem.text,
								votes: cardItem.votes,
								createdByTeam: subBoard.title.replace('board ', ''),
								createdBy: cardItem.createdBy,
								anonymous: cardItem.anonymous,
								comments: cardItem.comments.map((comment) => {
									return {
										text: comment.text,
										createdBy: comment.createdBy,
										anonymous: comment.anonymous
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

	updateChannelId(teams: TeamDto[]) {
		Promise.all(
			teams.map((team) =>
				this.boardModel.updateOne({ _id: team.boardId }, { slackChannelId: team.channelId })
			)
		);
	}
}
