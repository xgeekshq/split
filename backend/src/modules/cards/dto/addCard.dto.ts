import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import CardDto from './card.dto';

export class AddCardDto {
  @IsNotEmpty()
  @IsString()
  colIdToAdd!: string;

  @IsNotEmpty()
  @Type(() => CardDto)
  card!: CardDto;

  @IsNotEmpty()
  @IsString()
  socketId!: string;
}
