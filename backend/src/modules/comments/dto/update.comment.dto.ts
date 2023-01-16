import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { TextDto } from 'src/libs/dto/text.dto';

export default class UpdateCardCommentDto extends TextDto {
	@IsNotEmpty()
	@IsBoolean()
	anonymous!: boolean;

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
