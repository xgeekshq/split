import { ApiProperty } from '@nestjs/swagger';

import UserDto from '../dto/user.dto';

export class UsersWithTeamsResponse {
	@ApiProperty({
		type: UserDto
	})
	user!: UserDto;

	@ApiProperty({ type: String, isArray: true })
	teams?: string[];
}
