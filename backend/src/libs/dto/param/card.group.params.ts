import { IsMongoId, IsString } from 'class-validator';

import { BaseParam } from './base.param';

export class CardGroupParams extends BaseParam {
	@IsMongoId()
	@IsString()
	cardId!: string;
}
