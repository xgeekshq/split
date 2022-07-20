import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Inject,
	Param,
	Post,
	Req,
	UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { VoteGroupParams } from 'libs/dto/param/vote.group.params';
import { VoteItemParams } from 'libs/dto/param/vote.item.params';
import { DELETE_FAILED, INSERT_FAILED } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import SocketGateway from 'modules/socket/gateway/socket.gateway';

import { CreateVoteApplication } from '../interfaces/applications/create.vote.application.interface';
import { DeleteVoteApplication } from '../interfaces/applications/delete.vote.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Votes')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class VotesController {
	constructor(
		@Inject(TYPES.applications.CreateVoteApplication)
		private createVoteApp: CreateVoteApplication,
		@Inject(TYPES.applications.DeleteVoteApplication)
		private deleteVoteApp: DeleteVoteApplication,
		private socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Add a vote to a specific card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@Post(':boardId/card/:cardId/items/:itemId/vote')
	async addVoteToCard(
		@Req() request: RequestWithUser,
		@Param() params: VoteItemParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId, itemId } = params;
		const board = await this.createVoteApp.addVoteToCard(boardId, cardId, request.user._id, itemId);

		if (!board) throw new BadRequestException(INSERT_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Add a vote to a specific card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@Post(':boardId/card/:cardId/vote')
	async addVoteToCardGroup(
		@Req() request: RequestWithUser,
		@Param() params: VoteGroupParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId } = params;
		const board = await this.createVoteApp.addVoteToCardGroup(boardId, cardId, request.user._id);

		if (!board) throw new BadRequestException(INSERT_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Remove a vote from a specific card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@Delete(':boardId/card/:cardId/items/:itemId/vote')
	async deleteVoteFromCard(
		@Req() request: RequestWithUser,
		@Param() params: VoteItemParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId, itemId } = params;
		const board = await this.deleteVoteApp.deleteVoteFromCard(
			boardId,
			cardId,
			request.user._id,
			itemId
		);

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Remove a vote from a specific card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@Delete(':boardId/card/:cardId/vote')
	async deleteVoteFromCardGroup(
		@Req() request: RequestWithUser,
		@Param() params: VoteGroupParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId } = params;
		const board = await this.deleteVoteApp.deleteVoteFromCardGroup(
			boardId,
			cardId,
			request.user._id
		);

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}
}
