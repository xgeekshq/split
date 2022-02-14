import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../../libs/dto/base.dto';
import CardDto from './card.dto';

export class AddCardDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  colIdToAdd!: string;

  @IsNotEmpty()
  @Type(() => CardDto)
  card!: CardDto;
}
