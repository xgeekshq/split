import { IsMongoId, IsString } from 'class-validator';
import { CardGroupParams } from './card.group.params';

export class CommentGroupParams extends CardGroupParams {
	@IsMongoId()
	@IsString()
	commentId!: string;
}
