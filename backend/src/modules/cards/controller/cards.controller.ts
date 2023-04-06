import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Put,
	Req,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BaseParam } from 'src/libs/dto/param/base.param';
import { CardGroupParams } from 'src/libs/dto/param/card.group.params';
import { CardItemParams } from 'src/libs/dto/param/card.item.params';
import { MergeCardsParams } from 'src/libs/dto/param/merge.cards.params';
import { UnmergeCardsParams } from 'src/libs/dto/param/unmerge.cards.params';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import BoardDto from 'src/modules/boards/dto/board.dto';
import SocketGateway from '../../socket/gateway/socket.gateway';
import { CreateCardDto } from '../dto/create.card.dto';
import DeleteCardDto from '../dto/delete.card.dto';
import UnmergeCardsDto from '../dto/unmerge.dto';
import UpdateCardDto from '../dto/update.card.dto';
import { UpdateCardPositionDto } from '../dto/update-position.card.dto';
import { TYPES } from '../interfaces/types';
import { MergeCardDto } from '../dto/group/merge.card.dto';
import { DeleteCardApplicationInterface } from '../interfaces/applications/delete.card.application.interface';
import CreateCardUseCaseDto from '../dto/useCase/create-card.use-case.dto';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import CardCreationPresenter from '../dto/useCase/presenters/create-card-res.use-case.dto';
import UnmergeCardUseCaseDto from '../dto/useCase/unmerge-card.use-case.dto';
import MergeCardUseCaseDto from '../dto/useCase/merge-card.use-case.dto';
import UpdateCardPositionUseCaseDto from '../dto/useCase/update-card-position.use-case.dto';
import Board from 'src/modules/boards/entities/board.schema';
import UpdateCardTextUseCaseDto from '../dto/useCase/update-card-text.use-case.dto';
import UpdateCardGroupTextUseCaseDto from '../dto/useCase/update-card-group-text.use-case.dto';

@ApiBearerAuth('access-token')
@ApiTags('Cards')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class CardsController {
	constructor(
		@Inject(TYPES.applications.CreateCardUseCase)
		private readonly createCardUseCase: UseCase<CreateCardUseCaseDto, CardCreationPresenter>,
		@Inject(TYPES.applications.UpdateCardPositionUseCase)
		private readonly updateCardPositionUseCase: UseCase<UpdateCardPositionUseCaseDto, void>,
		@Inject(TYPES.applications.UpdateCardTextUseCase)
		private readonly updateCardTextUseCase: UseCase<UpdateCardTextUseCaseDto, Board>,
		@Inject(TYPES.applications.UpdateCardGroupTextUseCase)
		private readonly updateCardGroupTextUseCase: UseCase<UpdateCardGroupTextUseCaseDto, Board>,

		@Inject(TYPES.applications.DeleteCardApplication)
		private readonly deleteCardApp: DeleteCardApplicationInterface,
		@Inject(TYPES.applications.UnmergeCardUseCase)
		private readonly unmergeCardUseCase: UseCase<UnmergeCardUseCaseDto, string>,
		@Inject(TYPES.applications.MergeCardUseCase)
		private readonly mergeCardUseCase: UseCase<MergeCardUseCaseDto, boolean>,
		private readonly socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Create a new card' })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Card successfully created!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Post(':boardId/card')
	async addCard(
		@Req() request: RequestWithUser,
		@Param() { boardId }: BaseParam,
		@Body() createCardDto: CreateCardDto
	) {
		const { socketId } = createCardDto;

		const { newCardToReturn, newCardToSocket } = await this.createCardUseCase.execute({
			boardId,
			userId: request.user._id,
			createCardDto
		});

		createCardDto.newCard = newCardToSocket;
		this.socketService.sendAddCard(socketId, createCardDto);

		return newCardToReturn;
	}

	@ApiOperation({ summary: 'Delete a specific card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card successfully deleted!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Delete(':boardId/card/:cardId')
	async deleteCard(
		@Req() request: RequestWithUser,
		@Param() params: CardGroupParams,
		@Body() deleteCardDto: DeleteCardDto
	) {
		const { boardId, cardId } = params;
		await this.deleteCardApp.delete(boardId, cardId);
		this.socketService.sendDeleteCard(deleteCardDto.socketId, deleteCardDto);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Delete a specific card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card successfully delted!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Delete(':boardId/card/:cardId/items/:itemId')
	async deleteCardItem(@Param() params: CardItemParams, @Body() deleteCardDto: DeleteCardDto) {
		const { boardId, cardId, itemId } = params;
		await this.deleteCardApp.deleteFromCardGroup(boardId, cardId, itemId);
		this.socketService.sendDeleteCard(deleteCardDto.socketId, deleteCardDto);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Update a specific card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card item successfully updated!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId/items/:itemId')
	async updateCardText(
		@Req() request: RequestWithUser,
		@Param() params: CardItemParams,
		@Body() updateCardDto: UpdateCardDto
	) {
		const { boardId, cardId, itemId: cardItemId } = params;
		const { text, socketId } = updateCardDto;
		const userId = request.user._id;

		const board = await this.updateCardTextUseCase.execute({
			boardId,
			cardId,
			cardItemId,
			userId,
			text
		});

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdateCard(socketId, updateCardDto);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Update a specific card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card successfully updated!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId')
	async updateCardGroupText(
		@Req() request: RequestWithUser,
		@Param() params: CardGroupParams,
		@Body() updateCardDto: UpdateCardDto
	) {
		const { boardId, cardId } = params;
		const { text, socketId } = updateCardDto;
		const userId = request.user._id;

		const board = await this.updateCardGroupTextUseCase.execute({
			boardId,
			cardId,
			userId,
			text
		});

		if (board) {
			this.socketService.sendUpdateCard(socketId, updateCardDto);
		}

		return HttpStatus.OK;
	}

	@ApiOperation({
		summary: 'Change the card position',
		description:
			'This method is used to move card(s) between columns or change the position inside the actual column'
	})
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'The position of card is successfully updated!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Patch(':boardId/card/:cardId/position')
	async updateCardPosition(
		@Param() params: CardGroupParams,
		@Body() boardData: UpdateCardPositionDto
	) {
		const { boardId, cardId } = params;
		const { targetColumnId, newPosition, socketId } = boardData;

		const completionHandler = () => {
			this.socketService.sendUpdateCardPosition(socketId, boardData);
		};

		return await this.updateCardPositionUseCase.execute({
			boardId,
			cardId,
			targetColumnId,
			newPosition,
			completionHandler
		});
	}

	@ApiOperation({ summary: 'Merge two cards together' })
	@ApiParam({ name: 'targetCardId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Cards are successfully merged!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId/merge/:targetCardId')
	async mergeCards(
		@Req() request: RequestWithUser,
		@Param() params: MergeCardsParams,
		@Body() mergeCardsDto: MergeCardDto
	) {
		const { boardId, cardId: draggedCardId, targetCardId } = params;
		const { socketId } = mergeCardsDto;

		const board = await this.mergeCardUseCase.execute({ boardId, draggedCardId, targetCardId });

		if (board) this.socketService.sendMergeCards(socketId, mergeCardsDto);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Remove a card item from a group' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Cards are successfully unmerged!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId/cardItem/:itemId/removeFromCardGroup')
	async unmergeCards(
		@Param() params: UnmergeCardsParams,
		@Body() unmergeCardsDto: UnmergeCardsDto
	) {
		const { boardId, cardId: cardGroupId, itemId: draggedCardId } = params;
		const { columnId, socketId, newPosition: position } = unmergeCardsDto;

		const itemId = await this.unmergeCardUseCase.execute({
			boardId,
			cardGroupId,
			draggedCardId,
			columnId,
			position
		});

		unmergeCardsDto.newCardItemId = itemId;
		this.socketService.sendUnmergeCards(socketId, unmergeCardsDto);

		return itemId;
	}
}
