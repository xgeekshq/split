import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import BoardsService from './boards.service';
import BoardDto from './dto/board.dto';
import JwtAuthenticationGuard from '../../guards/jwtAuth.guard';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import ActionsGateway from '../../socket/socket.gateway';
import { UpdateCardPositionDto } from './dto/card/updateCardPosition.dto';
import { AddCardDto } from './dto/card/addCard.dto';
import DeleteCardDto from './dto/card/deleteCard.dto';
import UpdateCardDto from './dto/card/updateCard.dto';

@Controller('boards')
export default class BoardsController {
  constructor(
    private readonly boardService: BoardsService,
    private readonly socketService: ActionsGateway,
  ) {}

  // #region BOARD

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  createBoard(@Req() request: RequestWithUser, @Body() boardData: BoardDto) {
    const { _id: userId } = request.user;
    return this.boardService.create(boardData, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  boards(@Req() request: RequestWithUser) {
    const { _id: userId } = request.user;
    return this.boardService.getAllBoards(userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':boardId')
  getBoard(@Req() request: RequestWithUser) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    return this.boardService.getBoardWithEmail(boardId, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':boardId')
  updateBoard(@Req() request, @Body() boardData: BoardDto) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    return this.boardService.updateBoard(userId, boardId, boardData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId')
  deleteBoard(@Req() request: RequestWithUser) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    return this.boardService.deleteBoard(boardId, userId);
  }

  // #endregion

  // #region CARD

  @UseGuards(JwtAuthenticationGuard)
  @Post(':boardId/card')
  async addCard(@Req() request, @Body() createCardDto: AddCardDto) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    const { card, colIdToAdd, socketId } = createCardDto;
    const board = await this.boardService.addCardToBoard(
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
    const board = await this.boardService.deleteCard(boardId, cardId, userId);
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
    const board = await this.boardService.updateCardText(
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
    const board = await this.boardService.updateCardPosition(
      boardId,
      cardId,
      targetColumnId,
      newPosition,
    );
    this.socketService.sendUpdatedBoard(board, socketId);
    return board;
  }

  // #endregion
}
