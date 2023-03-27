import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class MergeCardUseCaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	boardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	draggedCardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	cardId: string;
}
