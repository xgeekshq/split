import User from '../schemas/user.schema';

export type UserWithTeams = {
	user: User;
	teams?: string[];
};
