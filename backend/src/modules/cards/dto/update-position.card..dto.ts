import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../../libs/dto/base.dto';

export class UpdateCardPositionDto extends BaseDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  targetColumnId!: string;

  @IsNotEmpty()
  @IsNumber()
  newPosition!: number;
}
