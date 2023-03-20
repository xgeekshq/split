import { BoardRoles } from 'src/modules/communication/dto/types';
import { UserDto } from 'src/modules/communication/dto/user.dto';

export enum ForTeamDtoEnum {
	TEAM = 'team',
	SUBTEAM = 'sub-team'
}

export class TeamDto {
	name!: string;

	normalName!: string;

	boardId!: string;

	channelId?: string;

	type!: ForTeamDtoEnum;

	for!: BoardRoles;

	participants!: UserDto[];

	participantsNotInvited?: string[];

	teamNumber: number;
}
