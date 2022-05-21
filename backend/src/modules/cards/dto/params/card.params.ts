import { IsMongoId } from 'class-validator';
import { BaseParam } from '../../../../libs/dto/param/base.param';

export class CardParams extends BaseParam {
  @IsMongoId()
  cardId!: string;
}
