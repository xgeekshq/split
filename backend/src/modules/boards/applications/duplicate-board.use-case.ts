import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CreateBoardServiceInterface } from 'src/modules/boards/interfaces/services/create.board.service.interface';
import Card from 'src/modules/cards/entities/card.schema';
import Column from 'src/modules/columns/entities/column.schema';
import { BoardRoles } from 'src/modules/communication/dto/types';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import * as Users from 'src/modules/users/interfaces/types';
import { Inject, Injectable } from '@nestjs/common';
import Board from '../entities/board.schema';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DuplicateBoardUseCase implements UseCase<{ boardId: string; userId: string }, Board> {
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface,
		@Inject(Users.TYPES.services.GetUserService)
		private getUserService: GetUserServiceInterface,
		@Inject(TYPES.services.CreateBoardService)
		private createBoardService: CreateBoardServiceInterface
	) {}

	async execute({ boardId, userId }) {
		const { _id, firstName, lastName, email, strategy } = await this.getUserService.getById(userId);

		const { board }: { board: any } = await this.getBoardService.getBoard(boardId, {
			_id,
			firstName,
			lastName,
			email,
			strategy
		});

		const users: any[] = [];
		const responsibles: string[] = [];

		board.users.forEach((user) => {
			users.push({
				user: user._id,
				role: user.role,
				votesCount: user.votesCount
			});

			if (user.role === BoardRoles.RESPONSIBLE) {
				responsibles.push(user._id!);
			}
		});

		const columns = board.columns.map((column: Column) => {
			delete column._id;

			return {
				...column,
				cards: column.cards.map((card: Card) => {
					delete card._id;

					return {
						...card,
						comments: card.comments.map((comment) => {
							delete comment._id;

							return {
								...comment
							};
						}),
						items: card.items.map((item) => {
							delete item._id;

							return {
								...item,
								comments: item.comments.map((comment) => {
									delete comment._id;

									return {
										...comment
									};
								})
							};
						})
					};
				})
			};
		});

		return await this.createBoardService.create(
			{
				...board,
				_id: undefined,
				id: undefined,
				columns,
				users,
				title: board.title + ' copy',
				team: board.team._id,
				responsibles,
				slackEnable: false,
				dividedBoards: [],
				hideVotes: board.hideVotes || false,
				hideCards: board.hideCards || false
			},
			userId
		);
	}
}
