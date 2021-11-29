import {
  Get,
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import AuthService from './auth.service';
import RegisterDto from '../users/dto/register.dto';
import LocalAuthGuard from '../guards/localAuth.guard';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import UsersService from '../users/users.service';
import JwtRefreshGuard from '../guards/jwtRefreshAuth.guard';
import LoginUserDto from '../users/dto/login.dto';

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
    const { user } = request;

    const userId = user._id.toString();

    const accessToken = this.authService.getJwtAccessToken(userId);
    user.password = undefined;

    const refreshToken = this.authService.getJwtRefreshToken(userId);

    await this.usersService.setCurrentRefreshToken(refreshToken.token, userId);

    const { name, email } = user;

    const userWToken: LoginUserDto = {
      name,
      email,
      accessToken,
      refreshToken,
    };
    return response.send(userWToken);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    return this.authService.getJwtAccessToken(request.user._id.toString());
  }
}
