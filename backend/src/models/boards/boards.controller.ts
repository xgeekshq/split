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
import ActionsGateway from '../../actions/actions.gateway';
import { UpdateCardPositionDto } from './dto/card/updateCardPosition.dto';

@Controller('boards')
export default class BoardsController {
  constructor(
    private readonly boardService: BoardsService,
    private readonly actionsService: ActionsGateway,
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
  @Get(':id')
  getBoard(@Req() request: RequestWithUser) {
    const { id: boardId } = request.params;
    const { _id: userId } = request.user;
    return this.boardService.getBoardWithEmail(boardId, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id')
  updateBoard(@Req() request, @Body() boardData: BoardDto) {
    const { _id: userId } = request.user;
    return this.boardService.updateBoard(userId, boardData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  deleteBoard(@Req() request: RequestWithUser) {
    const { id: boardId } = request.params;
    const { _id: userId } = request.user;
    return this.boardService.deleteBoard(boardId, userId);
  }

  // #endregion

  // #region CARD

  @Put(':id/card/:cardId/updateCardPosition')
  async updateCardPosition(
    @Req() request,
    @Body() boardData: UpdateCardPositionDto,
  ) {
    const { id: boardId, cardId } = request.params;
    const board = await this.boardService.updateCardPosition(
      boardId,
      cardId,
      boardData,
    );
    this.actionsService.sendUpdatedBoard(board, boardData.socketId);
    return board;
  }

  // #endregion
}
