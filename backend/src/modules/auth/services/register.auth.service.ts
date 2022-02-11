import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import RegisterDto from '../../users/dto/register.dto';
import { encrypt } from '../../../libs/utils/bcrypt';
import { CreateUserService } from '../../users/interfaces/services/create.user.service.interface';
import { TYPES } from '../../users/interfaces/types';
import { uniqueViolation } from '../../../infrastructure/database/errors/unique.user';
import { EMAIL_EXISTS } from '../../../libs/exceptions/messages';
import { RegisterAuthService } from '../interfaces/services/register.auth.service.interface';

@Injectable()
export default class RegisterAuthServiceImpl implements RegisterAuthService {
  constructor(
    @Inject(TYPES.services.CreateUserService)
    private createUserService: CreateUserService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await encrypt(registrationData.password);
    try {
      const createdUser = await this.createUserService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === uniqueViolation) {
        throw new BadRequestException(EMAIL_EXISTS);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
