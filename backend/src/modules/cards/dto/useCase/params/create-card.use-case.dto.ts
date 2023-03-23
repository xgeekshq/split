import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCardDto } from '../../create.card.dto';

export default class CreateCardUseCaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	boardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	userId: string;

	@ApiProperty()
	@IsNotEmpty()
	createCardDto: CreateCardDto;
}
