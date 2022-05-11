import { IsMongoId, IsString } from 'class-validator';
import { CardParams } from './card.params';

export class MergeCardParams extends CardParams {
  @IsMongoId()
  @IsString()
  card2Id!: string;
}
