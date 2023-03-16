import { Inject, Injectable } from '@nestjs/common';
import UpdateUserDto from '../dto/update.user.dto';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import UserDto from '../dto/user.dto';
import { UpdateSAdminUseCaseInterface } from '../interfaces/applications/update-sadmin.use-case.interface';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';

@Injectable()
export default class UpdateSAdminUseCase implements UpdateSAdminUseCaseInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	async execute(user: UpdateUserDto, requestUser: UserDto) {
		if (requestUser._id.toString() === user._id) {
			throw new UpdateFailedException();
		}

		const userUpdated = await this.userRepository.updateSuperAdmin(user._id, user.isSAdmin);

		if (!userUpdated) {
			throw new UpdateFailedException();
		}

		return userUpdated;
	}
}
