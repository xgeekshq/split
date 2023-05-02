import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import { TextDto } from 'src/libs/dto/text.dto';
import CreateCommentDto from 'src/modules/comments/dto/create.comment.dto';
import User from 'src/modules/users/entities/user.schema';

export default class CreateCommentUseCaseDto extends TextDto {
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

	@ApiProperty({ type: User })
	@Type(() => User)
	user: User;

	@ApiProperty()
	@IsBoolean()
	anonymous: boolean;

	@ApiProperty()
	@IsMongoId()
	columnId: string;

	completionHandler: (createCommentData: CreateCommentDto) => void;
}
