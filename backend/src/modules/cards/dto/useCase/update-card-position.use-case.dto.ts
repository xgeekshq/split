import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateCardPositionUseCaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	boardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	cardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	targetColumnId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	newPosition: number;

	completionHandler: () => void;
}
