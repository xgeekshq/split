import { LeanDocument } from 'mongoose';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDocument } from '../../users/schemas/user.schema';
import { TYPES } from '../interfaces/types';
import { ValidateUserAuthService } from '../interfaces/services/validate-user.auth.service.interface';
import { INVALID_CREDENTIALS } from '../../../libs/exceptions/messages';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TYPES.services.ValidateAuthService)
    private readonly validateUserAuthService: ValidateUserAuthService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<LeanDocument<UserDocument> | null> {
    const user = await this.validateUserAuthService.validateUserWithCredentials(
      email,
      password,
    );

    if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);

    return user;
  }
}
