import {
  Get,
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Inject,
  NotFoundException,
  BadRequestException,
  Param,
} from '@nestjs/common';
import LocalAuthGuard from '../../../libs/guards/localAuth.guard';
import RequestWithUser from '../../../libs/interfaces/requestWithUser.interface';
import JwtRefreshGuard from '../../../libs/guards/jwtRefreshAuth.guard';
import { TYPES } from '../interfaces/types';
import { RegisterAuthApplication } from '../interfaces/applications/register.auth.application.interface';
import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import {
  EMAIL_EXISTS,
  USER_NOT_FOUND,
} from '../../../libs/exceptions/messages';
import CreateUserDto from '../../users/dto/create.user.dto';
import { uniqueViolation } from '../../../infrastructure/database/errors/unique.user';
import { signIn } from '../shared/login.auth';
import * as User from '../../users/interfaces/types';
import * as Teams from '../../teams/interfaces/types';
import * as Boards from '../../boards/interfaces/types';
import { EmailParam } from '../../../libs/dto/param/email.param';
import { GetUserApplication } from '../../users/interfaces/applications/get.user.application.interface';
import JwtAuthenticationGuard from '../../../libs/guards/jwtAuth.guard';
import { GetBoardApplicationInterface } from '../../boards/interfaces/applications/get.board.application.interface';
import { GetTeamApplicationInterface } from '../../teams/interfaces/applications/get.team.application.interface';

@Controller('auth')
export default class AuthController {
  constructor(
    @Inject(TYPES.applications.RegisterAuthApplication)
    private registerAuthApp: RegisterAuthApplication,
    @Inject(TYPES.applications.GetTokenAuthApplication)
    private getTokenAuthApp: GetTokenAuthApplication,
    @Inject(User.TYPES.applications.GetUserApplication)
    private getUserApp: GetUserApplication,
    @Inject(Teams.TYPES.applications.GetTeamApplication)
    private getTeamsApp: GetTeamApplicationInterface,
    @Inject(Boards.TYPES.applications.GetBoardApplication)
    private getBoardApp: GetBoardApplicationInterface,
  ) {}

  @Post('register')
  async register(@Body() registrationData: CreateUserDto) {
    try {
      const { _id, firstName, lastName, email, password } =
        await this.registerAuthApp.register(registrationData);

      return { _id, firstName, lastName, email };
    } catch (error) {
      if (error.code === uniqueViolation) {
        throw new BadRequestException(EMAIL_EXISTS);
      }
      throw new BadRequestException(error.message);
    }
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const loggedUser = await signIn(
      request.user,
      this.getTokenAuthApp,
      'local',
    );
    if (!loggedUser) throw new NotFoundException(USER_NOT_FOUND);

    return loggedUser;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    return this.getTokenAuthApp.getAccessToken(request.user._id);
  }

  @Get('checkUserEmail/:email')
  checkEmail(@Param() { email }: EmailParam): Promise<boolean> {
    return this.getUserApp.getByEmail(email).then((user) => !!user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/dashboardStatistics')
  async getDashboardHeaderInfo(@Req() request: RequestWithUser) {
    const { _id: userId } = request.user;
    const [usersCount, teamsCount, boardsCount] = await Promise.all([
      this.getUserApp.countUsers(),
      this.getTeamsApp.countTeams(userId),
      this.getBoardApp.countBoards(userId),
    ]);
    return { usersCount, teamsCount, boardsCount };
  }
}
