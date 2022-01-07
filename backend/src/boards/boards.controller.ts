import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  describeExceptions,
  USER_NOT_FOUND,
} from '../constants/httpExceptions';
import BoardsService from './boards.service';
import BoardDto from './dto/board.dto';
import JwtAuthenticationGuard from '../guards/jwtAuth.guard';
import UsersService from '../users/users.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import BoardPasswordDto from './dto/boardPassword.dto';
import UpdateLockedDto from './dto/updateLockedDto';

@Controller('boards')
export default class BoardsController {
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
    throw new HttpException(
      describeExceptions(USER_NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  boards(@Req() request: RequestWithUser) {
    return this.boardService.getAllBoards(request.user.email);
  }

  @Post(':id')
  getBoard(@Req() request, @Body() passwordDto?: BoardPasswordDto) {
    return this.boardService.getBoardWithPassword(
      request.params.id,
      passwordDto?.password,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  getBoardWithAuth(@Req() request: RequestWithUser) {
    return this.boardService.getBoardWithEmail(
      request.params.id,
      request.user.email,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/updateLocked')
  updateLocked(
    @Req() request: RequestWithUser,
    @Body() updateLockedDto: UpdateLockedDto,
  ) {
    return this.boardService.updateLocked(
      updateLockedDto.locked,
      updateLockedDto.password,
      request.params.id,
      request.user.email,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  deleteBoard(@Req() request: RequestWithUser) {
    return this.boardService.deleteBoard(request.params.id, request.user.email);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/updateTitle')
  updateTitle(
    @Req() request: RequestWithUser,
    @Body() body: { title: string },
  ) {
    return this.boardService.updateTitle(
      request.params.id,
      request.user.email,
      body.title,
    );
  }
}
