import { IsMongoId } from 'class-validator';
import { CreateCommentParams } from './create.comment.params';

export class UpdateCommentParams extends CreateCommentParams {
  @IsMongoId()
  commentId!: string;
}
