import User from '../entities/user.schema';

export type UserWithTeams = {
	user: User;
	teams?: string[];
};
