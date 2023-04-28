import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import ResetPassword from '../entities/reset-password.schema';
import { ResetPasswordRepositoryInterface } from './reset-password.repository.interface';

@Injectable()
export class ResetPasswordRepository
	extends MongoGenericRepository<ResetPassword>
	implements ResetPasswordRepositoryInterface
{
	constructor(@InjectModel(ResetPassword.name) private readonly model: Model<ResetPassword>) {
		super(model);
	}
	updateToken(
		emailAddress: string,
		genToken: string,
		withSession?: boolean
	): Promise<ResetPassword> {
		return this.findOneByFieldAndUpdate(
			{ emailAddress },
			{
				emailAddress,
				token: genToken,
				updatedAt: new Date()
			},
			{ upsert: true, new: true },
			null,
			withSession
		);
	}

	findPassword(emailAddress: string): Promise<ResetPassword> {
		return this.findOneByField({ emailAddress });
	}

	getUserByToken(token: string) {
		return this.findOneByField({ token });
	}
}
