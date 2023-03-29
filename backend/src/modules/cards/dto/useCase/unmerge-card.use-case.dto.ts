import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UnmergeCardUseCaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	boardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	cardGroupId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	draggedCardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	columnId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	position: number;
}
