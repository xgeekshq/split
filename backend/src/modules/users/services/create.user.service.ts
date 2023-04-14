import { CREATE_FAILED } from 'src/libs/exceptions/messages';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import CreateUserDto from '../dto/create.user.dto';
import User from '../entities/user.schema';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import CreateGuestUserDto from '../dto/create.guest.user.dto';
import faker from '@faker-js/faker';
import { CreateUserServiceInterface } from '../interfaces/services/create.user.service.interface';

@Injectable()
export default class CreateUserService implements CreateUserServiceInterface {
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface
	) {}

	async create(userData: CreateUserDto) {
		const user: User = {
			...userData,
			strategy: '',
			isSAdmin: false,
			isDeleted: false,
			joinedAt: new Date(),
			isAnonymous: false
		};
		const createdUser = await this.userRepository.create(user);

		if (!createdUser) throw new BadRequestException(CREATE_FAILED);

		return createdUser;
	}

	async createGuest(guestUserData: CreateGuestUserDto) {
		const { firstName, lastName } = guestUserData;

		let email: string;
		let maxCount = 0;
		while (maxCount < 5) {
			email = faker.internet.email(firstName, lastName, '', { allowSpecialCharacters: true });

			const nUsersWithTheSameEmail = await this.userRepository.countDocumentsWithQuery({ email });
			const emailAlreadyExists = nUsersWithTheSameEmail > 0;

			if (!emailAlreadyExists) break;
			maxCount++;
		}

		const user: User = {
			firstName,
			lastName: lastName ?? '',
			password: '',
			email: email,
			strategy: '',
			isSAdmin: false,
			isDeleted: false,
			joinedAt: new Date(),
			isAnonymous: true,
			updatedAt: new Date()
		};
		const createdUser = await this.userRepository.create(user);

		if (!createdUser) throw new BadRequestException(CREATE_FAILED);

		return createdUser;
	}
}
