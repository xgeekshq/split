import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import User from 'src/modules/users/entities/user.schema';
import { UserRepositoryInterface } from './user.repository.interface';

@Injectable()
export class UserRepository
	extends MongoGenericRepository<User>
	implements UserRepositoryInterface
{
	constructor(@InjectModel(User.name) private model: Model<User>) {
		super(model);
	}

	getById(userId: string): Promise<User> {
		return this.findOneById(userId, {
			password: 0
		});
	}

	updateUserWithRefreshToken(refreshToken: string, userId: string) {
		return this.findOneByFieldAndUpdate(
			{ _id: userId },
			{ $set: { currentHashedRefreshToken: refreshToken } },
			{ new: true }
		);
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

	updateUserAvatar(userId: string, avatarUrl: string): Promise<User> {
		return this.findOneByFieldAndUpdate(
			{ _id: userId },
			{ $set: { avatar: avatarUrl } },
			{ new: true }
		);
	}

	deleteUser(userId: string, withSession: boolean) {
		return this.findOneAndRemove(userId, withSession);
	}

	getAllWithPagination(page: number, size: number, searchUser?: string) {
		let query: FilterQuery<User> = {
			$or: [{ isAnonymous: false }, { isAnonymous: undefined }]
		};

		if (searchUser) {
			query = {
				$and: [
					{ $or: [{ isAnonymous: false }, { isAnonymous: undefined }] },
					{
						$or: [
							{ firstName: { $regex: new RegExp('^.*' + searchUser + '.*$'), $options: 'i' } },
							{ lastName: { $regex: new RegExp('^.*' + searchUser + '.*$'), $options: 'i' } },
							{ email: { $regex: new RegExp('^.*' + searchUser + '.*$'), $options: 'i' } }
						]
					}
				]
			};
		}

		return this.model
			.find(query)
			.select('-password -__v -currentHashedRefreshToken -strategy -updatedAt -isDeleted')
			.skip(page * size)
			.limit(size)
			.sort({ firstName: 1, lastName: 1 })
			.exec();
	}

	getAllSignedUpUsers() {
		return this.model
			.find({ $or: [{ isAnonymous: false }, { isAnonymous: undefined }] })
			.select('-password')
			.sort({ firstName: 1, lastName: 1 })
			.exec();
	}

	getSignedUpUsersCount() {
		return this.model
			.find({ $or: [{ isAnonymous: false }, { isAnonymous: undefined }] })
			.count()
			.exec();
	}

	updateUserUpdatedAt(user: string) {
		return this.findOneByFieldAndUpdate({ _id: user }, { $set: { updatedAt: new Date() } });
	}
}
