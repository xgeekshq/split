import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';

export class UpdateCardPositionDto extends BaseDto {
	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	targetColumnId!: string;

	@IsNotEmpty()
	@IsNumber()
	newPosition!: number;

	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	boardId!: string;

	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	colIdOfCard: string;

	@IsNotEmpty()
	@IsNumber()
	cardPosition: number;

	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	cardId: string;

	@IsNotEmpty()
	@IsString()
	socketId: string;

	@IsNotEmpty()
	@IsBoolean()
	sorted: boolean;
}
