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
    const user = await this.usersService.getByEmail(boardData.createdBy.email);
    if (user) {
      return this.boardService.create(boardData);
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  boards(@Req() request: RequestWithUser) {
    return this.boardService.getAllBoards(request.user.email);
  }

  @Post(':id')
  getBoard(@Req() request, @Body() passwordDto?: BoardPasswordDto) {
    return this.boardService.getBoard(request.params.id, passwordDto.password);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/updateLocked')
  updateLocked(
    @Req() request: RequestWithUser,
    @Body() updateLockedDto: UpdateLockedDto,
  ) {
    const boardId = request.params.id;
    const user = request.user;
    return this.boardService.updateLocked(
      updateLockedDto.locked,
      updateLockedDto.password,
      boardId,
      user.email,
    );
  }
}
