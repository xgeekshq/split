import User from '../entities/user';

export type UserWithTeams = {
	user: User;
	teams?: string[];
};
