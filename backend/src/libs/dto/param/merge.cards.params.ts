import { IsMongoId, IsString } from 'class-validator';
import { CardGroupParams } from './card.group.params';

export class MergeCardsParams extends CardGroupParams {
  @IsMongoId()
  @IsString()
  targetCardId!: string;
}
