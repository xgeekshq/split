import { Inject, Injectable } from '@nestjs/common';
import { GetAllUsersUseCaseInterface } from '../interfaces/applications/get-all-users.use-case.interface';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';

@Injectable()
export default class GetAllUsersUseCase implements GetAllUsersUseCaseInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	execute() {
		return this.userRepository.getAllSignedUpUsers();
	}
}
