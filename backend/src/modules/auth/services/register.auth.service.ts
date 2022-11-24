import { Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { CreateUserService } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import { RegisterAuthService } from '../interfaces/services/register.auth.service.interface';

@Injectable()
export default class RegisterAuthServiceImpl implements RegisterAuthService {
	constructor(
		@Inject(TYPES.services.CreateUserService)
		private createUserService: CreateUserService
	) {}

	public async register(registrationData: CreateUserDto) {
		const hashedPassword = await encrypt(registrationData.password);

		return this.createUserService.create({
			...registrationData,
			password: hashedPassword
		});
	}
}
