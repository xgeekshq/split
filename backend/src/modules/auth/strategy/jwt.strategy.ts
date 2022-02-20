import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_ACCESS_TOKEN_SECRET } from '../../../libs/constants/jwt';
import { ValidateUserAuthService } from '../interfaces/services/validate-user.auth.service.interface';
import { TYPES } from '../interfaces/types';
import TokenPayload from '../../../libs/interfaces/jwt/token-payload.interface';
import { INVALID_CREDENTIALS } from '../../../libs/exceptions/messages';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(TYPES.services.ValidateAuthService)
    private readonly validateUserAuthService: ValidateUserAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_ACCESS_TOKEN_SECRET),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.validateUserAuthService.validateUserById(
      payload.userId,
    );
    if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);
    return user;
  }
}
