import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { CreateTeamDto } from './crate-team.dto';

export default class TeamDto extends CreateTeamDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	_id?: string;
}
