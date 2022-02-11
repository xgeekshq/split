import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { compare } from '../../../libs/utils/bcrypt';
import { TYPES } from '../../users/interfaces/types';
import { GetUserService } from '../../users/interfaces/services/get.user.service.interface';
import { INVALID_CREDENTIALS } from '../../../libs/exceptions/messages';
import { ValidateUserAuthService } from '../interfaces/services/validate-user.auth.service.interface';

@Injectable()
export default class ValidateUserAuthServiceImpl
  implements ValidateUserAuthService
{
  constructor(
    @Inject(TYPES.services.GetUserService)
    private getUserService: GetUserService,
  ) {}

  public async validateUserWithCredentials(
    email: string,
    plainTextPassword: string,
  ) {
    const user = await this.getUserService.getByEmail(email);
    if (!user) throw new UnauthorizedException();
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  public async validateUserById(userId: string) {
    const user = await this.getUserService.getById(userId);
    if (user) return user;
    throw new UnauthorizedException(INVALID_CREDENTIALS);
  }

  public async validateUserByRefreshToken(
    authorization: string,
    userId: string,
  ) {
    const refreshToken = authorization.replace('Bearer', '').trim();
    const user = await this.getUserService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );
    if (user) return user;
    throw new UnauthorizedException(INVALID_CREDENTIALS);
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }
  }
}
