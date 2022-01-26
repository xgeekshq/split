import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateCardDto {
  @IsNotEmpty()
  @IsString()
  text!: string;

  @IsNotEmpty()
  @IsString()
  socketId!: string;
}
