import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VoteGroupParams } from '../../../libs/dto/param/vote.group.params';
import { VoteItemParams } from '../../../libs/dto/param/vote.item.params';
import {
  DELETE_FAILED,
  INSERT_FAILED,
} from '../../../libs/exceptions/messages';
import JwtAuthenticationGuard from '../../../libs/guards/jwtAuth.guard';
import SocketGateway from '../../socket/gateway/socket.gateway';
import VoteDto from '../dto/vote.dto';
import { CreateVoteApplication } from '../interfaces/applications/create.vote.application.interface';
import { DeleteVoteApplication } from '../interfaces/applications/delete.vote.application.interface';

import { TYPES } from '../interfaces/types';

@Controller('boards')
export default class VotesController {
  constructor(
    @Inject(TYPES.applications.CreateVoteApplication)
    private createVoteApp: CreateVoteApplication,
    @Inject(TYPES.applications.DeleteVoteApplication)
    private deleteVoteApp: DeleteVoteApplication,
    private socketService: SocketGateway,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post(':boardId/card/:cardId/items/:itemId/vote')
  async addVoteToCard(
    @Req() request,
    @Param() params: VoteItemParams,
    @Body() createVoteDto: VoteDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId, cardId, itemId } = params;
    const board = await this.createVoteApp.addVoteToCard(
      boardId,
      cardId,
      userId,
      itemId,
    );
    if (!board) throw new BadRequestException(INSERT_FAILED);
    this.socketService.sendUpdatedBoard(board, createVoteDto.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post(':boardId/card/:cardId/vote')
  async addVoteToCardGroup(
    @Req() request,
    @Param() params: VoteGroupParams,
    @Body() createVoteDto: VoteDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId, cardId } = params;
    const board = await this.createVoteApp.addVoteToCardGroup(
      boardId,
      cardId,
      userId,
    );
    if (!board) throw new BadRequestException(INSERT_FAILED);
    this.socketService.sendUpdatedBoard(board, createVoteDto.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId/card/:cardId/items/:itemId/vote')
  async deleteVoteFromCard(
    @Req() request,
    @Param() params: VoteItemParams,
    @Body() deleteCardDto: VoteDto,
  ) {
    const userId = request.user._id;
    const { boardId, cardId, itemId } = params;
    const board = await this.deleteVoteApp.deleteVoteFromCard(
      boardId,
      cardId,
      userId,
      itemId,
    );
    if (!board) throw new BadRequestException(DELETE_FAILED);
    this.socketService.sendUpdatedBoard(board, deleteCardDto.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId/card/:cardId/vote/:userId')
  async deleteVoteFromCardGroup(
    @Req() request,
    @Param() params: VoteGroupParams,
    @Body() deleteCardDto: VoteDto,
  ) {
    const { boardId, cardId, userId } = params;
    const board = await this.deleteVoteApp.deleteVoteFromCardGroup(
      boardId,
      cardId,
      userId,
    );
    if (!board) throw new BadRequestException(DELETE_FAILED);
    this.socketService.sendUpdatedBoard(board, deleteCardDto.socketId);
    return board;
  }
}
