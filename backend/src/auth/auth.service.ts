import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import UsersService from '../models/users/users.service';
import Errors from '../database/types/errors';
import RegisterDto from '../models/users/dto/register.dto';
import { compare, encrypt } from '../utils/bcrypt';
import TokenPayload from '../interfaces/tokenPayload.interface';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from '../constants/jwt';
import {
  INVALID_CREDENTIALS,
  EMAIL_EXISTS,
  USER_NOT_FOUND,
} from '../constants/httpExceptions';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.getByEmail(email);
    if (!user) throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
  }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await encrypt(registrationData.password);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === Errors.UniqueViolation) {
        throw new HttpException(EMAIL_EXISTS, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getJwt(userId: string) {
    const accessToken = this.getJwtAccessToken(userId);
    const refreshToken = this.getJwtRefreshToken(userId);
    await this.usersService.setCurrentRefreshToken(refreshToken.token, userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  public getJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(JWT_ACCESS_TOKEN_SECRET),
      expiresIn: `${this.configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`,
    });
    return {
      expiresIn: this.configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
      token,
    };
  }

  public getJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(JWT_REFRESH_TOKEN_SECRET),
      expiresIn: `${this.configService.get(
        JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      )}d`,
    });
    return {
      expiresIn: this.configService.get(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
      token,
    };
  }
}
