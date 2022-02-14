import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../../../libs/guards/jwtAuth.guard';
import SocketGateway from '../../socket/gateway/socket.gateway';
import { AddCardDto } from '../dto/addCard.dto';
import DeleteCardDto from '../dto/deleteCard.dto';
import UpdateCardDto from '../dto/updateCard.dto';
import { UpdateCardPositionDto } from '../dto/updateCardPosition.dto';
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
  async addCard(@Req() request, @Body() createCardDto: AddCardDto) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    const { card, colIdToAdd, socketId } = createCardDto;
    const board = await this.createCardApp.create(
      boardId,
      userId,
      card,
      colIdToAdd,
    );
    this.socketService.sendUpdatedBoard(board, socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId/card/:cardId')
  async deleteCard(@Req() request, @Body() deleteCardDto: DeleteCardDto) {
    const {
      params: { boardId, cardId },
      user: { _id: userId },
    } = request;
    const board = await this.deleteCardApp.delete(boardId, cardId, userId);
    this.socketService.sendUpdatedBoard(board, deleteCardDto.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':boardId/card/:cardId/items/:cardItemId')
  async updateCardText(@Req() request, @Body() updateCardDto: UpdateCardDto) {
    const {
      params: { boardId, cardId, cardItemId },
      user: { _id: userId },
    } = request;
    const { text, socketId } = updateCardDto;
    const board = await this.updateCardApp.updateCardText(
      boardId,
      cardId,
      cardItemId,
      userId,
      text,
    );
    this.socketService.sendUpdatedBoard(board, socketId);
    return board;
  }

  @Put(':boardId/card/:cardId/updateCardPosition')
  async updateCardPosition(
    @Req() request,
    @Body() boardData: UpdateCardPositionDto,
  ) {
    const { boardId, cardId } = request.params;
    const { targetColumnId, newPosition, socketId } = boardData;
    const board = await this.updateCardApp.updateCardPosition(
      boardId,
      cardId,
      targetColumnId,
      newPosition,
    );
    this.socketService.sendUpdatedBoard(board, socketId);
    return board;
  }
}
