import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class GetAllBoardsUseCaseDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	team?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	userId!: string;

	@ApiProperty()
	@IsBoolean()
	isSAdmin!: boolean;

	@IsOptional()
	@IsNumber()
	page?: number;

	@IsOptional()
	@IsNumber()
	size?: number;
}
