import { Inject, Injectable } from '@nestjs/common';
import User from '../entities/user.schema';
import { GetUserUseCaseInterface } from '../interfaces/applications/get-user.use-case.interface';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetUserUseCase implements GetUserUseCaseInterface {
	constructor(
		@Inject(TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface
	) {}

	execute(id: string): Promise<User> {
		return this.getUserService.getById(id);
	}
}
