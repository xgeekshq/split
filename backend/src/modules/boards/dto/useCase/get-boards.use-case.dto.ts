import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class GetBoardsUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsOptional()
	@IsNumber()
	page?: number;

	@IsOptional()
	@IsNumber()
	size?: number;
}
