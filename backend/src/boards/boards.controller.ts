import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import BoardDto from './dto/board.dto';
import JwtAuthenticationGuard from '../guards/jwtAuth.guard';
import { UsersService } from '../users/users.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import BoardPasswordDto from './dto/boardPassword.dto';
import UpdateLockedDto from './dto/updateLockedDto';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardService: BoardsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createBoard(@Body() boardData: BoardDto) {
    const user = await this.usersService.getByEmail(boardData.createdBy);
    if (user) {
      return await this.boardService.create(boardData);
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async boards(@Req() request: RequestWithUser) {
    const user = request.user;
    const boards = await this.boardService.getAllBoards(user.email);
    return boards;
  }

  @Post(':id')
  async getBoard(@Req() request, @Body() passwordDto?: BoardPasswordDto) {
    const id = request.params.id;
    const board = await this.boardService.getBoard(id, passwordDto.password);
    return board;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/updateLocked')
  async updateLocked(
    @Req() request: RequestWithUser,
    @Body() updateLockedDto: UpdateLockedDto,
  ) {
    const boardId = request.params.id;
    const user = request.user;
    const board = await this.boardService.updateLocked(
      updateLockedDto.locked,
      updateLockedDto.password,
      boardId,
      user.email,
    );
    return board;
  }
}
