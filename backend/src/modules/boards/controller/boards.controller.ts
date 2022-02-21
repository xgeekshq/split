import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
import {
  BOARD_NOT_FOUND,
  DELETE_FAILED,
  INSERT_FAILED,
  UPDATE_FAILED,
} from '../../../libs/exceptions/messages';
import { BaseParam } from '../../../libs/dto/param/base.param';

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
  async createBoard(
    @Req() request: RequestWithUser,
    @Body() boardData: BoardDto,
  ) {
    const { _id: userId } = request.user;
    const board = await this.createBoardApp.create(boardData, userId);
    if (!board) throw new BadRequestException(INSERT_FAILED);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  boards(@Req() request: RequestWithUser) {
    const { _id: userId } = request.user;
    return this.getBoardApp.getAllBoards(userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':boardId')
  async getBoard(@Param() params: BaseParam, @Req() request: RequestWithUser) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId } = params;
    const board = await this.getBoardApp.getBoardWithEmail(boardId, userId);
    if (!board) throw new BadRequestException(BOARD_NOT_FOUND);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':boardId')
  async updateBoard(
    @Req() request,
    @Param() params: BaseParam,
    @Body() boardData: BoardDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId } = params;
    const board = await this.updateBoardApp.update(userId, boardId, boardData);
    if (!board) throw new BadRequestException(UPDATE_FAILED);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId')
  async deleteBoard(
    @Param() params: BaseParam,
    @Req() request: RequestWithUser,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId } = params;
    const result = await this.deleteBoardApp.delete(boardId, userId);
    if (!result) throw new BadRequestException(DELETE_FAILED);
    return result;
  }
}
