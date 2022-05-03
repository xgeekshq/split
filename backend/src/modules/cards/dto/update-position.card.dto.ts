import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../../libs/dto/base.dto';

export class UpdateCardPositionDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  targetColumnId!: string;

  @IsNotEmpty()
  @IsNumber()
  newPosition!: number;
}
