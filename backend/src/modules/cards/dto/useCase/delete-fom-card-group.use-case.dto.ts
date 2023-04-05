import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class DeleteFromCardGroupUseCaseDto {
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
	cardItemId: string;

	completionHandler: () => void;
}
