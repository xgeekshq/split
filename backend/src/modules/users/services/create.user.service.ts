import { Inject, Injectable } from '@nestjs/common';
import CreateUserDto from '../dto/create.user.dto';
import User from '../entities/user.schema';
import { CreateUserService } from '../interfaces/services/create.user.service.interface';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';

@Injectable()
export default class CreateUserServiceImpl implements CreateUserService {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	create(userData: CreateUserDto) {
		const user: User = {
			...userData,
			strategy: '',
			isSAdmin: false,
			isDeleted: false,
			joinedAt: new Date()
		};

		return this.userRepository.create(user);
	}
}
