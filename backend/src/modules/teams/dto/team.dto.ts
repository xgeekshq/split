import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';

import { CheckUniqueUsers } from 'libs/validators/check-unique-users';

import TeamUserDto from './team.user.dto';

export default class TeamDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ type: TeamUserDto, isArray: true })
	@IsNotEmpty()
	@Validate(CheckUniqueUsers)
	users!: TeamUserDto[];
}
