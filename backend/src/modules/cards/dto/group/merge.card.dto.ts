import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';

export class MergeCardDto extends BaseDto {
	@IsMongoId()
	@IsNotEmpty()
	userId!: string;

	@IsMongoId()
	@IsNotEmpty()
	colIdOfCardGroup: string;

	@IsMongoId()
	@IsNotEmpty()
	columnIdOfCard: string;

	@IsMongoId()
	@IsNotEmpty()
	cardId: string;

	@IsMongoId()
	@IsNotEmpty()
	boardId: string;

	@IsMongoId()
	@IsNotEmpty()
	cardGroupId: string;

	@IsNotEmpty()
	@IsString()
	socketId: string;

	@IsNotEmpty()
	@IsNumber()
	cardPosition: number;
}
