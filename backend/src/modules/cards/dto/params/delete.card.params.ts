import { IsMongoId } from 'class-validator';
import { BaseParam } from '../../../../libs/dto/param/base.param';

export class DeleteCardParams extends BaseParam {
  @IsMongoId()
  cardId!: string;
}
