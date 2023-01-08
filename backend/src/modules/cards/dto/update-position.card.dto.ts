import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';

export class UpdateCardPositionDto extends BaseDto {
	@IsNotEmpty()
	@IsMongoId()
	targetColumnId!: string;

	@IsNotEmpty()
	@IsNumber()
	newPosition!: number;

	@IsNotEmpty()
	@IsMongoId()
	boardId!: string;

	@IsNotEmpty()
	@IsMongoId()
	colIdOfCard: string;

	@IsNotEmpty()
	@IsNumber()
	cardPosition: number;

	@IsNotEmpty()
	@IsMongoId()
	cardId: string;

	@IsNotEmpty()
	@IsString()
	socketId: string;

	@IsNotEmpty()
	@IsBoolean()
	sorted: boolean;
}
