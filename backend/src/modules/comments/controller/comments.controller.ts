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
import RequestWithUser from '../../../libs/interfaces/requestWithUser.interface';
import SocketGateway from '../../socket/gateway/socket.gateway';
import CreateCommentDto from '../dto/create.comment.dto';
import DeleteCommentDto from '../dto/delete.comment.dto';
import { CreateCommentParams } from '../dto/params/create.comment.params';
import { DeleteCommentParams } from '../dto/params/delete.comment.params';
import { UpdateCommentParams } from '../dto/params/update.comment.params';
import UpdateCardCommentDto from '../dto/update.comment.dto';
import { CreateCommentApplication } from '../interfaces/applications/create.comment.application.interface';
import { DeleteCommentApplication } from '../interfaces/applications/delete.comment.application.interface';
import { UpdateCommentApplication } from '../interfaces/applications/update.comment.application.interface';
import { TYPES } from '../interfaces/types';

@Controller('boards')
export default class CommentsController {
  constructor(
    @Inject(TYPES.services.CreateCommentService)
    private createCommentApp: CreateCommentApplication,
    @Inject(TYPES.services.UpdateCommentService)
    private updateCommentApp: UpdateCommentApplication,
    @Inject(TYPES.services.DeleteCommentService)
    private deleteCommentApp: DeleteCommentApplication,
    private socketService: SocketGateway,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post(':boardId/card/:cardId/items/:itemId/comment')
  async addItemComment(
    @Req() request: RequestWithUser,
    @Param()
    params: CreateCommentParams,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId, cardId, itemId } = params;
    const { text } = createCommentDto;

    const board = await this.createCommentApp.createItemComment(
      boardId,
      cardId,
      itemId,
      userId,
      text,
    );
    if (!board) throw new BadRequestException(INSERT_FAILED);
    this.socketService.sendUpdatedBoard(board, createCommentDto.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':boardId/card/:cardId/items/:itemId/comment/:commentId')
  async updateCardItemComment(
    @Req() request: RequestWithUser,
    @Param() params: UpdateCommentParams,
    @Body() commentData: UpdateCardCommentDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId, cardId, itemId, commentId } = params;
    const { text } = commentData;
    const board = await this.updateCommentApp.updateItemComment(
      boardId,
      cardId,
      itemId,
      commentId,
      userId,
      text,
    );
    if (!board) throw new BadRequestException(UPDATE_FAILED);
    this.socketService.sendUpdatedBoard(board, commentData.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':boardId/card/:cardId/items/:itemId/comment/:commentId')
  async deleteCardItemComment(
    @Req() request: RequestWithUser,
    @Param() params: DeleteCommentParams,
    @Body() deleteData: DeleteCommentDto,
  ) {
    const {
      user: { _id: userId },
    } = request;
    const { boardId, commentId } = params;
    const board = await this.deleteCommentApp.deleteItemComment(
      boardId,
      commentId,
      userId,
    );
    if (!board) throw new BadRequestException(DELETE_FAILED);
    this.socketService.sendUpdatedBoard(board, deleteData.socketId);
    return board;
  }
}
