import { Inject, Injectable } from '@nestjs/common';
import { BoardNotFoundException } from 'src/libs/exceptions/boardNotFoundException';
import { CreateFailedException } from 'src/libs/exceptions/createFailedBadRequestException';
import { CREATE_FAILED } from 'src/libs/exceptions/messages';
import { UserNotFoundException } from 'src/libs/exceptions/userNotFoundException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import BoardUserDto from 'src/modules/boardUsers/dto/board.user.dto';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import Card from 'src/modules/cards/entities/card.schema';
import Column from 'src/modules/columns/entities/column.schema';
import Team from 'src/modules/teams/entities/team.schema';
import User from 'src/modules/users/entities/user.schema';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import * as Users from 'src/modules/users/interfaces/types';
import Board from '../entities/board.schema';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { GET_BOARD_SERVICE, TYPES } from '../constants';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';

export type DuplicateBoardDto = { boardId: string; userId: string; boardTitle: string };

@Injectable()
export class DuplicateBoardUseCase implements UseCase<DuplicateBoardDto, Board> {
	constructor(
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface,
		@Inject(Users.TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface,
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.CreateBoardUserService)
		private readonly createBoardUserService: CreateBoardUserServiceInterface
	) {}

	async execute({ boardId, userId, boardTitle }: DuplicateBoardDto) {
		const currentUser = await this.getUserService.getById(userId);

		if (!currentUser) {
			throw new UserNotFoundException();
		}
		const { _id, firstName, lastName, email, strategy } = currentUser;

		const { board } = await this.getBoardService.getBoard(boardId, {
			_id,
			firstName,
			lastName,
			email,
			strategy
		});

		if (!board) {
			throw new BoardNotFoundException();
		}

		const boardTeam = board.team as Team;
		const users: BoardUserDto[] = board.users.map((user) => {
			const userData = user.user as User;
			delete user._id;

			return {
				...user,
				board: user.board as string,
				user: userData._id
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
						createdBy: card.createdBy as string,
						votes: card.votes as string[],
						comments: card.comments.map((comment) => {
							delete comment._id;

							return {
								...comment,
								createdBy: comment.createdBy as string
							};
						}),
						items: card.items.map((item) => {
							delete item._id;

							return {
								...item,
								createdBy: item.createdBy as string,
								votes: item.votes as string[],
								comments: item.comments.map((comment) => {
									delete comment._id;

									return {
										...comment,
										createdBy: comment.createdBy as string
									};
								})
							};
						})
					};
				})
			};
		});

		const newBoard = await this.boardRepository.create<Board>({
			...board,
			_id: undefined,
			createdAt: undefined,
			updatedAt: undefined,
			users,
			columns,
			title: boardTitle,
			team: boardTeam?._id,
			slackEnable: false,
			isSubBoard: false,
			dividedBoards: []
		});

		if (!newBoard) throw new CreateFailedException(CREATE_FAILED);

		await this.createBoardUserService.saveBoardUsers(users, newBoard._id);

		return newBoard;
	}
}
