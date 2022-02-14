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
import RequestWithUser from '../../../libs/interfaces/requestWithUser.interface';
import SocketGateway from '../../socket/gateway/socket.gateway';
import CommentDto from '../dto/comment';
import DeleteCommentDto from '../dto/deleteComment.dto';
import UpdateCardCommentDto from '../dto/updateComment.dto';
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
  @Post(':id/card/:cardId/items/:itemId/comment')
  async addItemComment(
    @Req() request: RequestWithUser,
    @Body() createCommentDto: CommentDto,
  ) {
    const {
      params: { id: boardId, cardId, itemId },
      user: { _id: userId },
    } = request;
    const { text } = createCommentDto;

    const board = await this.createCommentApp.createItemComment(
      boardId,
      cardId,
      itemId,
      userId,
      text,
    );
    this.socketService.sendUpdatedBoard(board, createCommentDto.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id/card/:cardId/items/:cardItemId/comment/:commentId')
  async updateCardItemComment(
    @Req() request: RequestWithUser,
    @Body() commentData: UpdateCardCommentDto,
  ) {
    const {
      params: { id: boardId, cardId, cardItemId, commentId },
      user: { _id: userId },
    } = request;
    const { text } = commentData;
    const board = await this.updateCommentApp.updateItemComment(
      boardId,
      cardId,
      cardItemId,
      commentId,
      userId,
      text,
    );
    this.socketService.sendUpdatedBoard(board, commentData.socketId);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id/card/:cardId/items/:cardItemId/comment/:commentId')
  async deleteCardItemComment(
    @Req() request: RequestWithUser,
    @Body() deleteData: DeleteCommentDto,
  ) {
    const {
      params: { id: boardId, commentId },
      user: { _id: userId },
    } = request;
    const board = await this.deleteCommentApp.deleteItemComment(
      boardId,
      commentId,
      userId,
    );
    this.socketService.sendUpdatedBoard(board, deleteData.socketId);
    return board;
  }
}
