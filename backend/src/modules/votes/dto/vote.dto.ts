import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class VoteDto {
	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	cardId: string;

	@IsOptional()
	@IsMongoId()
	@IsString()
	cardItemId?: string;

	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	boardId: string;

	@IsNotEmpty()
	@IsString()
	socketId?: string;

	@IsNotEmpty()
	@IsBoolean()
	isCardGroup: boolean;

	@IsNotEmpty()
	@IsNumber()
	count: number;

	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	userId: string;
}
