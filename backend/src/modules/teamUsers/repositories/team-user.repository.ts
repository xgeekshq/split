import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import User from 'src/modules/users/entities/user.schema';
import { UserWithTeams } from 'src/modules/users/interfaces/type-user-with-teams';
import TeamUser, { TeamUserDocument } from '../entities/team.user.schema';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import TeamUserDto from '../dto/team.user.dto';

@Injectable()
export class TeamUserRepository
	extends MongoGenericRepository<TeamUser>
	implements TeamUserRepositoryInterface
{
	constructor(@InjectModel(TeamUser.name) private model: Model<TeamUserDocument>) {
		super(model);
	}

	// CREATE

	// GET

	countTeamsOfUser(userId: string): Promise<number> {
		return this._repository.find({ user: userId }).distinct('team').count().exec();
	}

	getAllTeamsOfUser(userId: string): Promise<TeamUser[]> {
		return this._repository.find({ user: userId }).distinct('team').exec();
	}

	getUsersOfTeam(teamId: string) {
		return this.findAllWithQuery(
			{ team: teamId },
			null,
			'user role isNewJoiner canBeResponsible _id',
			{
				path: 'user',
				select: '_id firstName lastName email isSAdmin joinedAt providerAccountCreatedAt'
			}
		);
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

	getTeamUser(userId: string, teamId: string): Promise<TeamUser> {
		return this.findOneByField({ user: userId, team: teamId });
	}

	// UPDATE

	updateTeamUser(teamData: TeamUserDto): Promise<TeamUser | null> {
		return this.findOneByFieldAndUpdate(
			{ user: teamData.user, team: teamData.team },
			{
				$set: {
					role: teamData.role,
					isNewJoiner: teamData.isNewJoiner,
					canBeResponsible: teamData.canBeResponsible
				}
			}
		);
	}

	// DELETE

	deleteTeamUser(teamUserId: string, withSession: boolean): Promise<TeamUser> {
		return this.findByIdAndDelete(teamUserId, withSession);
	}

	deleteTeamUsers(teamUsers: string[], withSession: boolean): Promise<number> {
		return this.deleteMany(
			{
				_id: { $in: teamUsers }
			},
			withSession
		);
	}

	deleteTeamUsersOfTeam(teamId: string, withSession: boolean): Promise<number> {
		return this.deleteMany(
			{
				team: teamId
			},
			withSession
		);
	}

	deleteTeamUsersOfUser(userId: string, withSession: boolean): Promise<number> {
		return this.deleteMany({ user: userId }, withSession);
	}
}
