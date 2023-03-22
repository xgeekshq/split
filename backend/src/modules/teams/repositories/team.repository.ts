import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Team, { TeamDocument } from '../entities/team.schema';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';

@Injectable()
export class TeamRepository
	extends MongoGenericRepository<Team>
	implements TeamRepositoryInterface
{
	constructor(@InjectModel(Team.name) private model: Model<TeamDocument>) {
		super(model);
	}

	getTeam(teamId: string): Promise<Team> {
		return this.findOneById(
			teamId,
			{ _id: 1, name: 1 },
			{
				path: 'users',
				select: 'user role isNewJoiner canBeResponsible',
				populate: {
					path: 'user',
					select: '_id firstName lastName email joinedAt providerAccountCreatedAt'
				}
			}
		);
	}

	getTeamsWithUsers(teamIds: string[]): Promise<Team[]> {
		return this.findAllWithQuery({ _id: { $in: teamIds } }, null, { _id: 1, name: 1 }, [
			{
				path: 'users',
				select: 'user role isNewJoiner canBeResponsible',
				populate: {
					path: 'user',
					select: '_id firstName lastName email joinedAt providerAccountCreatedAt'
				}
			}
		]);
	}

	getAllTeams(): Promise<Team[]> {
		return this.findAllWithQuery(null, null, null, [
			{
				path: 'users',
				select: 'user role email isNewJoiner canBeResponsible',
				populate: {
					path: 'user',
					select: '_id firstName lastName email joinedAt providerAccountCreatedAt'
				}
			}
		]);
	}
}
