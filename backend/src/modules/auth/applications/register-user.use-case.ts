import { EMAIL_EXISTS } from 'src/libs/exceptions/messages';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import { RegisterUserUseCaseInterface } from '../interfaces/applications/register-user.use-case.interface';
import { uniqueViolation } from 'src/infrastructure/database/errors/unique.user';

@Injectable()
export default class RegisterUserUseCase implements RegisterUserUseCaseInterface {
	constructor(
		@Inject(TYPES.services.CreateUserService)
		private createUserService: CreateUserServiceInterface
	) {}

	public async execute(registrationData: CreateUserDto) {
		const hashedPassword = await encrypt(registrationData.password);

		try {
			const { _id, firstName, lastName, email } = await this.createUserService.create({
				...registrationData,
				password: hashedPassword
			});

			return { _id, firstName, lastName, email };
		} catch (error) {
			if (error.code === uniqueViolation) {
				throw new BadRequestException(EMAIL_EXISTS);
			}

			throw new BadRequestException(error.message);
		}
	}
}
