import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamRoles } from 'src/libs/enum/team.roles';

export class TeamQueryParams {
	@IsString()
	@IsOptional()
	@IsEnum(TeamRoles, { each: true })
	teamUserRole?: TeamRoles;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => [true, 'true', '', '1'].includes(value))
	loadUsers?: boolean;
}
