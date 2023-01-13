import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';

export default class DeleteCardDto extends BaseDto {
	@ApiProperty()
	@IsMongoId()
	cardId: string;

	@ApiProperty()
	@IsMongoId()
	boardId: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	isCardGroup: boolean;

	@ApiProperty()
	@IsOptional()
	@IsMongoId()
	cardItemId?: string;

	@ApiProperty()
	@IsMongoId()
	columnId: string;

	@ApiProperty()
	@IsMongoId()
	userId: string;
}
