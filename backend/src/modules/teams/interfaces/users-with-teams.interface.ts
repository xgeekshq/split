import { ObjectId } from 'mongoose';

export interface UsersWithTeams {
	_id: ObjectId;
	teamsNames: Array<Array<string>>;
}
