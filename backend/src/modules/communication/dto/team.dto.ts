import { BoardRoles } from 'src/modules/communication/dto/types';
import { UserDto } from 'src/modules/communication/dto/user.dto';

export class TeamDto {
  name!: string;

  normalName!: string;

  boardId!: string;

  channelId?: string;

  type!: 'team' | 'sub-team';

  for!: BoardRoles;

  participants!: UserDto[];

  participantsNotInvited?: string[];
}
