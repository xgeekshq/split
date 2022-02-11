import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import User from '../../users/schemas/user.schema';
import { TYPES } from '../interfaces/types';
import { ValidateUserAuthService } from '../interfaces/services/validate-user.auth.service.interface';

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

  validate(email: string, password: string): Promise<User> {
    return this.validateUserAuthService.validateUserWithCredentials(
      email,
      password,
    );
  }
}
