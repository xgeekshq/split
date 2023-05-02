import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId } from 'class-validator';

export default class DeleteCommentUseCaseDto {
	@ApiProperty()
	@IsMongoId()
	boardId: string;

	@ApiProperty()
	@IsMongoId()
	commentId: string;

	@ApiProperty()
	@IsMongoId()
	userId: string;

	@ApiProperty()
	@IsBoolean()
	isCardGroup: boolean;

	completionHandler: () => void;
}
