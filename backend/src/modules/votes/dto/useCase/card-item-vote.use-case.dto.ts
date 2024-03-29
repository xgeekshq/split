import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CardItemVoteUseCaseDto {
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

	completionHandler: () => void;
}
