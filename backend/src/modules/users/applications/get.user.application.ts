import { Inject, Injectable } from '@nestjs/common';
import { GetUserApplication } from '../interfaces/applications/get.user.application.interface';
import { GetUserService } from '../interfaces/services/get.user.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetUserApplicationImpl implements GetUserApplication {
	constructor(
		@Inject(TYPES.services.GetUserService)
		private getUserService: GetUserService
	) {}

	getByEmail(email: string) {
		return this.getUserService.getByEmail(email);
	}

	countUsers() {
		return this.getUserService.countUsers();
	}

	getAllUsers() {
		return this.getUserService.getAllUsers();
	}

	getUsersOnlyWithTeams() {
		return this.getUserService.getAllUsersWithTeams();
	}
}
