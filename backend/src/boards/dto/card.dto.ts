import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import UserDto from '../../users/dto/user.dto';

export default class CardDto {
  @IsNotEmpty()
  @IsString()
  _id?: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  title!: string;

  @IsNotEmpty()
  @Type(() => UserDto)
  createdBy!: UserDto;
}
