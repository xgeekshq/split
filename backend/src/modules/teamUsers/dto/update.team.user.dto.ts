import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export default class UpdateTeamUserDto {
	@ApiProperty({ description: 'List of users to add on team' })
	@IsArray()
	addUsers!: TeamUserDto[];

	@ApiProperty({ description: 'List of users ids to remove from team' })
	@IsArray()
	removeUsers!: string[];
}
