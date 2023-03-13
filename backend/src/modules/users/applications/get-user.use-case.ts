import { Inject, Injectable } from '@nestjs/common';
import User from '../entities/user.schema';
import { GetUserUseCaseInterface } from '../interfaces/applications/get-user.use-case.interface';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';

@Injectable()
export class GetUserUseCase implements GetUserUseCaseInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	execute(id: string): Promise<User> {
		return this.userRepository.getById(id);
	}
}
