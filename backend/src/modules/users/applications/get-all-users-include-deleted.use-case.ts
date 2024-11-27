import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../constants';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import User from '../entities/user.schema';

@Injectable()
export default class GetAllUsersIncludeDeletedUseCase implements UseCase<void, User[]> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: UserRepositoryInterface
	) {}

	execute() {
		return this.userRepository.getAllUsersIncludeDeleted();
	}
}
