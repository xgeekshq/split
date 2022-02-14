import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import BoardDto from '../dto/board.dto';
import JwtAuthenticationGuard from '../../../libs/guards/jwtAuth.guard';
import RequestWithUser from '../../../libs/interfaces/requestWithUser.interface';
import { TYPES } from '../interfaces/types';
import { CreateBoardApplication } from '../interfaces/applications/create.board.application.interface';
import { GetBoardApplication } from '../interfaces/applications/get.board.application.interface';
import { DeleteBoardApplication } from '../interfaces/applications/delete.board.application.interface';
import { UpdateBoardApplication } from '../interfaces/applications/update.board.application.interface';

@Controller('boards')
export default class BoardsController {
  constructor(
    @Inject(TYPES.applications.CreateBoardApplication)
    private createBoardApp: CreateBoardApplication,
    @Inject(TYPES.applications.GetBoardApplication)
    private getBoardApp: GetBoardApplication,
    @Inject(TYPES.applications.UpdateBoardApplication)
    private updateBoardApp: UpdateBoardApplication,
    @Inject(TYPES.applications.DeleteBoardApplication)
    private deleteBoardApp: DeleteBoardApplication,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  createBoard(@Req() request: RequestWithUser, @Body() boardData: BoardDto) {
    const { _id: userId } = request.user;
    return this.createBoardApp.create(boardData, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  boards(@Req() request: RequestWithUser) {
    const { _id: userId } = request.user;
    return this.getBoardApp.getAllBoards(userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':boardId')
  getBoard(@Req() request: RequestWithUser) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    return this.getBoardApp.getBoardWithEmail(boardId, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':boardId')
  updateBoard(@Req() request, @Body() boardData: BoardDto) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    return this.updateBoardApp.update(userId, boardId, boardData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId')
  deleteBoard(@Req() request: RequestWithUser) {
    const {
      user: { _id: userId },
      params: { boardId },
    } = request;
    return this.deleteBoardApp.delete(boardId, userId);
  }
}
