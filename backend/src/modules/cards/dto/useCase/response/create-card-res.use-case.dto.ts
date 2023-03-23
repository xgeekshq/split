import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import Card from 'src/modules/cards/entities/card.schema';

export default class CreateCardResUseCaseDto {
	@ApiProperty()
	@IsNotEmpty()
	newCardToReturn: Card;

	@ApiProperty()
	@IsNotEmpty()
	newCardToSocket: Card;
}
