import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateCardTextUseCaseDto {
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

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	userId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	text: string;

	completionHandler: () => void;
}
