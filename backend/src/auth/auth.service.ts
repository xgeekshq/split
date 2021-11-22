import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import errors from '../database/types/errors';
import RegisterDto from '../users/dto/register.dto';
import { compare, encrypt } from '../utils/bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from '../interfaces/tokenPayload.interface';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
  describeJWT,
} from '../constants/jwt';
import {
  INVALID_CREDENTIALS,
  EMAIL_EXISTS,
  describeExceptions,
} from '../constants/httpExceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        describeExceptions(INVALID_CREDENTIALS),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        describeExceptions(INVALID_CREDENTIALS),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await encrypt(registrationData.password);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === errors.UniqueViolation) {
        throw new HttpException(
          describeExceptions(EMAIL_EXISTS),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public getJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(describeJWT(JWT_ACCESS_TOKEN_SECRET)),
      expiresIn: `${this.configService.get(
        describeJWT(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
      )}s`,
    });
    return {
      expiresIn: this.configService.get(
        describeJWT(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
      ),
      token,
    };
  }

  public getJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(describeJWT(JWT_REFRESH_TOKEN_SECRET)),
      expiresIn: `${this.configService.get(
        describeJWT(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
      )}d`,
    });
    return {
      expiresIn: this.configService.get(
        describeJWT(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
      ),
      token,
    };
  }
}
