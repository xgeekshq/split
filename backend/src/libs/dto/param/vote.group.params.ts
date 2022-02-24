import { IsMongoId, IsString } from 'class-validator';
import { CardGroupParams } from './card.group.params';

export class VoteGroupParams extends CardGroupParams {
  @IsMongoId()
  @IsString()
  userId!: string;
}
