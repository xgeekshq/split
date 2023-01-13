import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsString } from 'class-validator';
import { TextDto } from 'src/libs/dto/text.dto';

export default class UpdateCardDto extends TextDto {
	@ApiProperty()
	@IsMongoId()
	cardId: string;

	@ApiProperty()
	@IsMongoId()
	cardItemId: string;

	@ApiProperty()
	@IsString()
	text: string;

	@ApiProperty()
	@IsMongoId()
	boardId: string;

	@ApiProperty()
	@IsBoolean()
	isCardGroup: boolean;
}
