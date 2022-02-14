import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../../libs/dto/base.dto';

export class UpdateCardPositionDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  targetColumnId!: string;

  @IsNotEmpty()
  @IsNumber()
  newPosition!: number;
}
