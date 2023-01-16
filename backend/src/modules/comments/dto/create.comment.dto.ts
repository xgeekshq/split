import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { TextDto } from 'src/libs/dto/text.dto';
import Comment from '../schemas/comment.schema';

export default class CreateCommentDto extends TextDto {
	@ApiPropertyOptional({ description: 'User Id' })
	@IsOptional()
	@IsMongoId()
	createdBy?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	anonymous!: boolean;

	@ApiProperty()
	@IsMongoId()
	boardId: string;

	@ApiProperty()
	@IsMongoId()
	cardId: string;

	@ApiProperty()
	@IsMongoId()
	@IsOptional()
	cardItemId?: string;

	@ApiProperty()
	@IsMongoId()
	columnId: string;

	@ApiProperty()
	@IsBoolean()
	isCardGroup: boolean;

	newComment?: Comment;
}
