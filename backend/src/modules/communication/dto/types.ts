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
	slackChannelId?: string;
};

export type ConfigurationType = {
	slackApiBotToken: string;
	slackMasterChannelId: string;
	slackChannelPrefix: string;
	frontendUrl: string;
};

export type ChangeResponsibleType = {
	newResponsibleEmail: string;
	previousResponsibleEmail: string;
	subTeamChannelId: string;
	email: string;
	teamNumber: number;
	responsiblesChannelId?: string;
	mainChannelId?: string;
};

export type MergeBoardType = {
	teamNumber: number;
	responsiblesChannelId: string;
	isLastSubBoard: boolean;
	boardId: string;
	mainBoardId: string;
};

export type ArchiveChannelResult = { channelId: string; result: boolean };
