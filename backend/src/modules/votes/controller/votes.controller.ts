import { Body, Controller, HttpStatus, Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { VoteGroupParams } from 'src/libs/dto/param/vote.group.params';
import { VoteItemParams } from 'src/libs/dto/param/vote.item.params';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { SocketIdDto } from 'src/libs/swagger/dto/socket-id.swagger';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import BoardDto from 'src/modules/boards/dto/board.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import VoteDto from '../dto/vote.dto';
import { CreateVoteApplicationInterface } from '../interfaces/applications/create.vote.application.interface';
import { DeleteVoteApplicationInterface } from '../interfaces/applications/delete.vote.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Votes')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class VotesController {
	constructor(
		@Inject(TYPES.applications.CreateVoteApplication)
		private createVoteApp: CreateVoteApplicationInterface,
		@Inject(TYPES.applications.DeleteVoteApplication)
		private deleteVoteApp: DeleteVoteApplicationInterface,
		private socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Add or Remove a vote to/from a specific card item' })
	@ApiBody({
		type: SocketIdDto,
		required: false,
		description: 'If you want real time updates, you need to pass the socket id.'
	})
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Vote added successfully to a card.'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId/items/:itemId/vote')
	async handleVote(
		@Req() request: RequestWithUser,
		@Param() params: VoteItemParams,
		@Body() data: VoteDto
	) {
		const { boardId, cardId, itemId } = params;
		const { count, socketId } = data;

		if (count < 0) {
			await this.deleteVoteApp.deleteVoteFromCard(boardId, cardId, request.user._id, itemId, count);
		} else {
			await this.createVoteApp.addVoteToCard(boardId, cardId, request.user._id, itemId, count);
		}

		this.socketService.sendUpdatedBoard(boardId, socketId);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Add/remove a vote to/from a specific card' })
	@ApiBody({
		type: SocketIdDto,
		required: false,
		description: 'If you want real time updates, you need to pass the socket id.'
	})
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Vote added successfully to a card item.'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId/vote')
	async handleVoteGroup(
		@Req() request: RequestWithUser,
		@Param() params: VoteGroupParams,
		@Body() data: VoteDto
	) {
		const { boardId, cardId } = params;
		const { count, socketId } = data;

		if (count < 0) {
			await this.deleteVoteApp.deleteVoteFromCardGroup(boardId, cardId, request.user._id, count);
		} else {
			await this.createVoteApp.addVoteToCardGroup(boardId, cardId, request.user._id, count);
		}

		this.socketService.sendUpdatedBoard(boardId, socketId);

		return HttpStatus.OK;
	}
}
