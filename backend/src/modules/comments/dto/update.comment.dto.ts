import { IsBoolean, IsNotEmpty } from 'class-validator';
import { TextDto } from 'src/libs/dto/text.dto';

export default class UpdateCardCommentDto extends TextDto {
	@IsNotEmpty()
	@IsBoolean()
	anonymous!: boolean;
}
