import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { TeamRoles } from 'libs/enum/team.roles';

export default class TeamUserDto {
	@ApiProperty({ description: 'User id' })
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	user!: string;

	@ApiProperty({ type: String, enum: TeamRoles, enumName: 'Roles' })
	@IsString()
	@IsNotEmpty()
	@IsEnum(TeamRoles, { each: true })
	role!: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsMongoId()
	team?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	@IsMongoId()
	isNewJoiner?: boolean;
}
