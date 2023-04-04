import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateCardGroupVoteUseCaseDto {
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
	@IsNumber()
	count: number;

	@IsOptional()
	@IsNumber()
	retryCount?: number;
}
