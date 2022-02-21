import { Injectable, Inject } from '@nestjs/common';
import { encrypt } from '../../../libs/utils/bcrypt';
import { CreateUserService } from '../../users/interfaces/services/create.user.service.interface';
import { TYPES } from '../../users/interfaces/types';
import { RegisterAuthService } from '../interfaces/services/register.auth.service.interface';
import CreateUserDto from '../../users/dto/create.user.dto';

@Injectable()
export default class RegisterAuthServiceImpl implements RegisterAuthService {
  constructor(
    @Inject(TYPES.services.CreateUserService)
    private createUserService: CreateUserService,
  ) {}

  public async register(registrationData: CreateUserDto) {
    const hashedPassword = await encrypt(registrationData.password);
    return this.createUserService.create({
      ...registrationData,
      password: hashedPassword,
    });
  }
}
