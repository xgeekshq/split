import { IsMongoId, IsString } from 'class-validator';
import { CardItemParams } from './card.item.params';

export class CommentItemParams extends CardItemParams {
  @IsMongoId()
  @IsString()
  commentId!: string;
}
