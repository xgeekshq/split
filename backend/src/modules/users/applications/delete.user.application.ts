import { DeleteUserApplicationInterface } from './../interfaces/applications/delete.user.application';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';

@Injectable()
export class DeleteTeamApplicationImpl implements DeleteUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteUserService)
		private deleteUserServices: DeleteUserApplicationInterface
	) {}

	delete(request: RequestWithUser, userId: string) {
		return this.deleteUserServices.delete(request, userId);
	}
}
