import { DeleteUserApplicationInterface } from './../interfaces/applications/delete.user.application';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import UserDto from '../dto/user.dto';

@Injectable()
export class DeleteTeamApplicationImpl implements DeleteUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteUserService)
		private deleteUserServices: DeleteUserApplicationInterface
	) {}

	delete(user: UserDto, userId: string) {
		return this.deleteUserServices.delete(user, userId);
	}
}
