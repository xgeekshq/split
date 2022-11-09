import { ChangeResponsibleDto } from './changeResponsible.dto';

export enum BoardRoles {
	MEMBER = 'member',
	RESPONSIBLE = 'responsible'
}

export type ProfileType = {
	id: string;
	email: string;
};

export type UserType = {
	id: string;
	firstName: string;
	lastName: string;
	email?: string;
	board?: string;
};

export type UserRoleType = {
	id: string;
	role: BoardRoles;
	user: UserType;
	board?: string;
};

export type BoardType = {
	id: string;
	title: string;
	isSubBoard: boolean;
	dividedBoards: BoardType[];
	team: {
		name: string;
		users: UserRoleType[];
	} | null;
	users: UserRoleType[];
};

export type ConfigurationType = {
	slackApiBotToken: string;
	slackMasterChannelId: string;
	slackChannelPrefix: string;
	frontendUrl: string;
};

export type JobResponsibleType = {
	changeResponsibleDto: ChangeResponsibleDto;
	config: ConfigurationType;
};
