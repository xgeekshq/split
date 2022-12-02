import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import UserEntity from '../entities/user';
import User, { UserDocument } from '../entities/user.schema';
import { UserRepositoryInterface } from './user.repository.interface';

@Injectable()
export class UserRepository
	extends MongoGenericRepository<UserEntity>
	implements UserRepositoryInterface
{
	constructor(@InjectModel(User.name) private model: Model<UserDocument>) {
		super(model);
	}
}
