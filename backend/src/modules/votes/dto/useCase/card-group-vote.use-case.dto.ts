import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CardGroupVoteUseCaseDto {
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

	completionHandler: () => void;
}
