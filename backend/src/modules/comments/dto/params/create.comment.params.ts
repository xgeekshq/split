import { IsMongoId } from 'class-validator';
import { UpdateCardParams } from '../../../cards/dto/params/update-position.card.params';

export class CreateCommentParams extends UpdateCardParams {
  @IsMongoId()
  cardId!: string;

  @IsMongoId()
  itemId!: string;
}
