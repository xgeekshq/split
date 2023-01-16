import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';

export default class DeleteCommentDto extends BaseDto {
	@ApiProperty()
	@IsMongoId()
	cardId: string;

	@ApiProperty()
	@IsMongoId()
	@IsOptional()
	cardItemId?: string;

	@ApiProperty()
	@IsMongoId()
	commentId: string;

	@ApiProperty()
	@IsMongoId()
	boardId: string;

	@ApiProperty()
	@IsBoolean()
	isCardGroup: boolean;
}
