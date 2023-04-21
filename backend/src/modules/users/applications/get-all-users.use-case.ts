import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import User from '../entities/user.schema';

@Injectable()
export default class GetAllUsersUseCase implements UseCase<void, User[]> {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	execute() {
		return this.userRepository.getAllSignedUpUsers();
	}
}
