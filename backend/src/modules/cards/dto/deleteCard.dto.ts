import { IsNotEmpty, IsString } from 'class-validator';

export default class DeleteCardDto {
  @IsNotEmpty()
  @IsString()
  socketId!: string;
}
