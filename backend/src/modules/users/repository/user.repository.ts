import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import User, { UserDocument } from '../entities/user.schema';
import { UserRepositoryInterface } from './user.repository.interface';

@Injectable()
export class UserRepository
	extends MongoGenericRepository<User>
	implements UserRepositoryInterface
{
	constructor(@InjectModel(User.name) private model: Model<UserDocument>) {
		super(model);
	}

	getById(userId: string): Promise<User> {
		return this.findOneById(userId, {
			password: 0,
			currentHashedRefreshToken: 0
		});
	}

	updateUserWithRefreshToken(refreshToken: string, userId: string) {
		return this.findOneByFieldAndUpdate({ _id: userId }, { $set: { refreshToken } });
	}

	updateUserPassword(email: string, password: string) {
		return this.findOneByFieldAndUpdate(
			{ email },
			{
				$set: { password }
			}
		);
	}

	updateSuperAdmin(userId: string, isSAdmin: boolean) {
		return this.findOneByFieldAndUpdate({ _id: userId }, { $set: { isSAdmin } }, { new: true });
	}

	deleteUser(userId: string, withSession: boolean) {
		return this.findOneAndRemove(userId, withSession);
	}
}
