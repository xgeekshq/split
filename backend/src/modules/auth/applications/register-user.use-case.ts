import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { CREATE_USER_SERVICE } from 'src/modules/users/constants';
import { RegisterUserUseCaseInterface } from '../interfaces/applications/register-user.use-case.interface';
import { uniqueViolation } from 'src/infrastructure/database/errors/unique.user';
import { EmailExistsException } from '../exceptions/emailExistsException';

@Injectable()
export default class RegisterUserUseCase implements RegisterUserUseCaseInterface {
	constructor(
		@Inject(CREATE_USER_SERVICE)
		private readonly createUserService: CreateUserServiceInterface
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
				throw new EmailExistsException();
			}

			throw new BadRequestException(error.message);
		}
	}
}
