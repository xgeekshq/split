import {
  Get,
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { USER_NOT_FOUND } from 'src/constants/httpExceptions';
import AuthService from './auth.service';
import RegisterDto from '../models/users/dto/register.dto';
import LocalAuthGuard from '../guards/localAuth.guard';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import UsersService from '../models/users/users.service';
import JwtRefreshGuard from '../guards/jwtRefreshAuth.guard';
import LoggedUserDto from '../models/users/dto/loggedUser.dto';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const {
      user: { _id: id, name, email },
    } = request;

    if (id) {
      const { accessToken, refreshToken } = await this.authService.getJwt(id);

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

    throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const {
      user: { _id: id },
    } = request;
    if (id) {
      return this.authService.getJwtAccessToken(id);
    }
    throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
