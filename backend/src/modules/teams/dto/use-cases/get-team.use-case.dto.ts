import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';

export class GetTeamUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	teamId: string;

	@ApiProperty()
	@IsOptional()
	teamQueryParams?: TeamQueryParams;
}
