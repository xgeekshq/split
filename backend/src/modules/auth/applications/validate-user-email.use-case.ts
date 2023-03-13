import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from 'src/modules/users/interfaces/types';
import { ValidateUserEmailUseCaseInterface } from '../interfaces/applications/validate-email.use-case.interface';
import { UserRepositoryInterface } from 'src/modules/users/repository/user.repository.interface';

@Injectable()
export default class ValidateUserEmailUseCase implements ValidateUserEmailUseCaseInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	async execute(email: string) {
		const user = await this.userRepository.findOneByField({ email });

		return !!user;
	}
}
