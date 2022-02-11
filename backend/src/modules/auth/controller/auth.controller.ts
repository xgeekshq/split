import {
  Get,
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import RegisterDto from '../../users/dto/register.dto';
import LocalAuthGuard from '../../../libs/guards/localAuth.guard';
import RequestWithUser from '../../../libs/interfaces/requestWithUser.interface';
import JwtRefreshGuard from '../../../libs/guards/jwtRefreshAuth.guard';
import LoggedUserDto from '../../users/dto/loggedUser.dto';
import { TYPES } from '../interfaces/types';
import { RegisterAuthApplication } from '../interfaces/applications/register.auth.application.interface';
import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import { USER_NOT_FOUND } from '../../../libs/exceptions/messages';

@Controller('auth')
export default class AuthController {
  constructor(
    @Inject(TYPES.applications.RegisterAuthApplication)
    private registerAuthApp: RegisterAuthApplication,
    @Inject(TYPES.applications.GetTokenAuthApplication)
    private getTokenAuthApp: GetTokenAuthApplication,
  ) {}

  @Post('register')
  register(@Body() registrationData: RegisterDto) {
    return this.registerAuthApp.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const {
      user: { _id: id, name, email },
    } = request;

    if (id) {
      const { accessToken, refreshToken } =
        await this.getTokenAuthApp.getTokens(id);

      const userWToken: LoggedUserDto = {
        id,
        name,
        email,
        accessToken: accessToken.token,
        accessTokenExpiresIn: accessToken.expiresIn,
        refreshToken: refreshToken.token,
        refreshTokenExpiresIn: refreshToken.expiresIn,
      };
      return response.send(userWToken);
    }

    throw new NotFoundException(USER_NOT_FOUND);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const {
      user: { _id: id },
    } = request;
    if (id) {
      return this.getTokenAuthApp.getAccessToken(id);
    }
    throw new NotFoundException(USER_NOT_FOUND);
  }
}
