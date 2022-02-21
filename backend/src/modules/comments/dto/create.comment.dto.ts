import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../../libs/dto/base.dto';

export default class CreateCommentDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  text!: string;
}
