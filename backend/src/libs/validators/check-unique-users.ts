import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import BoardUserDto from 'modules/boards/dto/board.user.dto';
import TeamUserDto from 'modules/teams/dto/team.user.dto';

@ValidatorConstraint({ name: 'checkUniqueUsers', async: false })
export class CheckUniqueUsers implements ValidatorConstraintInterface {
	validate(users: BoardUserDto[] | TeamUserDto[]) {
		const usersIds = users.map((user) => user.user);
		if (usersIds.length === new Set(usersIds).size) {
			return true;
		}

		return false;
	}

	defaultMessage() {
		return 'Duplicate users are not allowed';
	}
}
