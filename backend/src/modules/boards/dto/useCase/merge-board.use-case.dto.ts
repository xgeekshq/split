import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class MergeBoardUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	subBoardId: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	userId: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	socketId?: string;

	completionHandler: () => void;
}
