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

@Controller('auth')
export default class AuthController {
  constructor(
    @Inject(TYPES.applications.RegisterAuthApplication)
    private registerAuthApp: RegisterAuthApplication,
    @Inject(TYPES.applications.GetTokenAuthApplication)
    private getTokenAuthApp: GetTokenAuthApplication,
  ) {}

  @Post('register')
  async register(@Body() registrationData: CreateUserDto) {
    try {
      const user = await this.registerAuthApp.register(registrationData);
      return { _id: user._id, name: user.name, email: user.email };
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
    const { user } = request;

    const loggedUser = await signIn(user, this.getTokenAuthApp, 'local');
    if (!loggedUser) throw new NotFoundException(USER_NOT_FOUND);
    return loggedUser;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const {
      user: { _id: id },
    } = request;
    return this.getTokenAuthApp.getAccessToken(id);
  }
}
