import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { CheckUniqueUsers } from 'src/libs/validators/check-unique-users';
import TeamUserDto from '../../teamUsers/dto/team.user.dto';

export class CreateTeamDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ type: TeamUserDto, isArray: true })
	@IsNotEmpty()
	@Validate(CheckUniqueUsers)
	users!: TeamUserDto[];
}
