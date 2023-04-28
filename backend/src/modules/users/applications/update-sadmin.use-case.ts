import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../constants';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import User from '../entities/user.schema';
import UpdateSAdminUseCaseDto from '../dto/useCase/update-sadmin.use-case.dto';

@Injectable()
export default class UpdateSAdminUseCase implements UseCase<UpdateSAdminUseCaseDto, User> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: UserRepositoryInterface
	) {}

	async execute({ user, requestUser }: UpdateSAdminUseCaseDto) {
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
