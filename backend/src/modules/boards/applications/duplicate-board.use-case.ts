import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import Card from 'src/modules/cards/entities/card.schema';
import Column from 'src/modules/columns/entities/column.schema';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import * as Users from 'src/modules/users/interfaces/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import BoardDto from '../dto/board.dto';
import Board from '../entities/board.schema';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_NOT_FOUND, USER_NOT_FOUND } from 'src/libs/exceptions/messages';

@Injectable()
export class DuplicateBoardUseCase
	implements UseCase<{ boardId: string; userId: string; boardTitle: string }, Board>
{
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface,
		@Inject(Users.TYPES.services.GetUserService)
		private getUserService: GetUserServiceInterface,
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.CreateBoardUserService)
		private createBoardUserService: CreateBoardUserServiceInterface
	) {}

	async execute({ boardId, userId, boardTitle }) {
		const currentUser = await this.getUserService.getById(userId);

		if (!currentUser) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		const { _id, firstName, lastName, email, strategy } = currentUser;

		const { board }: { board: any } = await this.getBoardService.getBoard(boardId, {
			_id,
			firstName,
			lastName,
			email,
			strategy
		});

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		const users = board.users.map((user) => {
			delete user._id;

			return {
				...user,
				user: user.user._id
			};
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

		const newBoard = await this.boardRepository.create<BoardDto>({
			...board,
			_id: undefined,
			id: undefined,
			createdAt: undefined,
			updatedAt: undefined,
			users,
			columns,
			title: boardTitle,
			team: board.team._id,
			slackEnable: false,
			isSubBoard: false,
			dividedBoards: []
		});

		await this.createBoardUserService.saveBoardUsers(users, newBoard._id);

		return newBoard;
	}
}
