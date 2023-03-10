import { UserDto } from 'src/modules/communication/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export default class CommentDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@ApiProperty({ description: 'User Id' })
	@IsNotEmpty()
	createdBy!: string | UserDto;

	@IsNotEmpty()
	@IsBoolean()
	anonymous!: boolean;
}
