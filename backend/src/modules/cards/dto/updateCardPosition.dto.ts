import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCardPositionDto {
  @IsNotEmpty()
  @IsString()
  targetColumnId!: string;

  @IsNotEmpty()
  @IsNumber()
  newPosition!: number;

  @IsNotEmpty()
  @IsString()
  socketId!: string;
}
