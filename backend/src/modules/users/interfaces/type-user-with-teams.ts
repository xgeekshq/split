import UserDto from '../dto/user.dto';

export type UserWithTeams = {
	user: UserDto;
	teams?: string[];
};
