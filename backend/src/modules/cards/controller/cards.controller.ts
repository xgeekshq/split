import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  DELETE_FAILED,
  INSERT_FAILED,
  UPDATE_FAILED,
} from '../../../libs/exceptions/messages';
import JwtAuthenticationGuard from '../../../libs/guards/jwtAuth.guard';
import SocketGateway from '../../socket/gateway/socket.gateway';
import { CreateCardDto } from '../dto/create.card.dto';
import DeleteCardDto from '../dto/delete.card.dto';
import { CreateCardParams } from '../dto/params/create.card.params';
import { DeleteCardParams } from '../dto/params/delete.card.params';
import { UpdateCardParams } from '../dto/params/update-position.card.params';
import { UpdatePositionCardParams } from '../dto/params/update-text.card.params copy';
import UpdateCardDto from '../dto/update.card.dto';
import { UpdateCardPositionDto } from '../dto/update-position.card..dto';
import { CreateCardApplication } from '../interfaces/applications/create.card.application.interface';
import { DeleteCardApplication } from '../interfaces/applications/delete.card.application.interface';
import { UpdateCardApplication } from '../interfaces/applications/update.card.application.interface';
import { TYPES } from '../interfaces/types';

@Controller('boards')
export default class CardsController {
  constructor(
    @Inject(TYPES.applications.CreateCardApplication)
    private createCardApp: CreateCardApplication,
    @Inject(TYPES.applications.UpdateCardApplication)
    private updateCardApp: UpdateCardApplication,
    @Inject(TYPES.applications.DeleteCardApplication)
    private deleteCardApp: DeleteCardApplication,
    private socketService: SocketGateway,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post(':boardId/card')
  async addCard(
    @Req() request,
    @Param()
    params: CreateCardParams,
    @Body() createCardDto: CreateCardDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId } = params;
    const { card, colIdToAdd, socketId } = createCardDto;
    const board = await this.createCardApp.create(
      boardId,
      userId,
      card,
      colIdToAdd,
    );
    if (!board) throw new BadRequestException(INSERT_FAILED);
    this.socketService.sendUpdatedBoard(board, socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId/card/:cardId')
  async deleteCard(
    @Req() request,
    @Param()
    params: DeleteCardParams,
    @Body() deleteCardDto: DeleteCardDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId, cardId } = params;
    const board = await this.deleteCardApp.delete(boardId, cardId, userId);
    if (!board) throw new BadRequestException(DELETE_FAILED);
    this.socketService.sendUpdatedBoard(board, deleteCardDto.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':boardId/card/:cardId/items/:itemId')
  async updateCardText(
    @Req() request,
    @Param()
    params: UpdateCardParams,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId, cardId, itemId } = params;
    const { text, socketId } = updateCardDto;
    const board = await this.updateCardApp.updateCardText(
      boardId,
      cardId,
      itemId,
      userId,
      text,
    );
    if (!board) throw new BadRequestException(UPDATE_FAILED);
    this.socketService.sendUpdatedBoard(board, socketId);
    return board;
  }

  @Put(':boardId/card/:cardId/updateCardPosition')
  async updateCardPosition(
    @Req() request,
    @Param()
    params: UpdatePositionCardParams,
    @Body() boardData: UpdateCardPositionDto,
  ) {
    const { boardId, cardId } = params;
    const { targetColumnId, newPosition, socketId } = boardData;
    const board = await this.updateCardApp.updateCardPosition(
      boardId,
      cardId,
      targetColumnId,
      newPosition,
    );
    if (!board) throw new BadRequestException(UPDATE_FAILED);
    this.socketService.sendUpdatedBoard(board, socketId);
    return board;
  }
}
