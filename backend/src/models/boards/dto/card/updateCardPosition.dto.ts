import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCardPositionDto {
  @IsNotEmpty()
  @IsString()
  columnId!: string;

  @IsNotEmpty()
  @IsString()
  cardId!: string;

  @IsNotEmpty()
  @IsString()
  boardId!: string;

  @IsNotEmpty()
  @IsNumber()
  position!: number;

  @IsNotEmpty()
  @IsString()
  socketId!: string;
}
