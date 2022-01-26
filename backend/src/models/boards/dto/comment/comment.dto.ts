import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CommentDto {
  @Optional()
  _id?: string;

  @IsNotEmpty()
  @IsString()
  text!: string;

  @IsNotEmpty()
  @IsString()
  createdBy!: string;

  @IsNotEmpty()
  @IsString()
  socketId!: string;
}
