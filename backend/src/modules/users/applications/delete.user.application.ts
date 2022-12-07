import { DeleteUserApplicationInterface } from './../interfaces/applications/delete.user.application';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteTeamApplicationImpl implements DeleteUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteUserService)
		private deleteUserServices: DeleteUserApplicationInterface
	) {}

	delete(userId: string) {
		return this.deleteUserServices.delete(userId);
	}
}
