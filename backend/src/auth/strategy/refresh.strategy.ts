import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import UsersService from '../../users/users.service';
import TokenPayload from '../../interfaces/tokenPayload.interface';
import {
  describeExceptions,
  UNAUTHORIZED,
} from '../../constants/httpExceptions';

@Injectable()
export default class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const { authorization } = request.headers;
    if (!authorization)
      throw new HttpException(describeExceptions(UNAUTHORIZED), 401);
    const refreshToken = authorization.replace('Bearer', '').trim();
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
