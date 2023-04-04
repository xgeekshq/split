import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateVoteUseCaseDto {
	@IsNotEmpty()
	@IsString()
	boardId: string;

	@IsNotEmpty()
	@IsString()
	cardId: string;

	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	cardItemId: string;

	@IsNotEmpty()
	@IsNumber()
	count: number;

	@IsOptional()
	@IsNumber()
	retryCount?: number;
}
