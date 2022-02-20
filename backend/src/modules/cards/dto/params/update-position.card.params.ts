import { IsMongoId } from 'class-validator';
import { BaseParam } from '../../../../libs/dto/param/base.param';

export class UpdateCardParams extends BaseParam {
  @IsMongoId()
  cardId!: string;

  @IsMongoId()
  itemId!: string;
}
