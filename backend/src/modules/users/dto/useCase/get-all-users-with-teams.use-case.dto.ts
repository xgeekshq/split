import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class GetAllUsersWithTeamsUseCaseDto {
	@ApiProperty()
	@IsNumber()
	@IsOptional()
	page?: number;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	size?: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	searchUser?: string;
}
