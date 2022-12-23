import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import User from 'src/modules/users/entities/user.schema';
import { UserWithTeams } from 'src/modules/users/interfaces/type-user-with-teams';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser, { TeamUserDocument } from '../entities/team.user.schema';
import { TeamUserRepositoryInterface } from './team-user.repository.interface';

@Injectable()
export class TeamUserRepository
	extends MongoGenericRepository<TeamUser>
	implements TeamUserRepositoryInterface
{
	constructor(@InjectModel(TeamUser.name) private model: Model<TeamUserDocument>) {
		super(model);
	}

	countTeamsOfUser(userId: string) {
		return this._repository.find({ user: userId }).distinct('team').count().exec();
	}

	updateTeamUser(teamData: TeamUserDto): Promise<TeamUser | null> {
		return this.findOneByFieldAndUpdate(
			{ user: teamData.user, team: teamData.team },
			{ $set: { role: teamData.role, isNewJoiner: teamData.isNewJoiner } }
		);
	}

	getAllTeamsOfUser(userId: string): Promise<TeamUser[]> {
		return this._repository.find({ user: userId }).distinct('team').exec();
	}

	getUsersOfTeam(teamId: string) {
		return this.findAllWithQuery({ team: teamId }, undefined, {
			path: 'user',
			select: '_id firstName lastName email isSAdmin'
		});
	}

	getUsersOnlyWithTeams(users: User[]): Promise<UserWithTeams[]> {
		const ids = users.map((user) => new ObjectId(user._id));

		return this._repository
			.aggregate([
				{
					$match: { $expr: { $in: ['$user', ids] } }
				},
				{
					$lookup: {
						from: 'users',
						localField: 'user',
						foreignField: '_id',
						as: 'user'
					}
				},
				{
					$lookup: {
						from: 'teams',
						localField: 'team',
						foreignField: '_id',
						as: 'teams'
					}
				},
				{
					$unwind: { path: '$user' }
				},
				{
					$unwind: { path: '$teams' }
				},
				{
					$group: {
						_id: '$user',
						teamsName: { $push: '$teams.name' }
					}
				},
				{
					$set: { userWithTeam: '$_id' }
				},
				{
					$unset: [
						'_id',
						'user.currentHashedRefreshToken',
						'user.isSAdmin',
						'user.joinedAt',
						'user.isDeleted'
					]
				},
				{
					$project: {
						user: '$userWithTeam',
						teamsNames: '$teamsName'
					}
				}
			])
			.exec();
	}

	deleteTeamUser(userId: string, withSession: boolean): Promise<number> {
		return this.deleteMany({ user: userId }, withSession);
	}

	deleteTeamOfUserOnly(userId: string, teamId: string, withSession: boolean): Promise<TeamUser> {
		return this.findOneAndRemoveByField({ user: userId, team: teamId }, withSession);
	}
}
