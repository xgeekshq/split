import { Inject, Injectable } from '@nestjs/common';
import User from '../entities/user.schema';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import { GET_USER_SERVICE } from '../constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

@Injectable()
export class GetUserUseCase implements UseCase<string, User> {
	constructor(
		@Inject(GET_USER_SERVICE)
		private readonly getUserService: GetUserServiceInterface
	) {}

	execute(id: string): Promise<User> {
		return this.getUserService.getById(id);
	}
}
