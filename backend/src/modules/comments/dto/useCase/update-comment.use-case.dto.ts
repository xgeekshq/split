import UpdateCardCommentDto from 'src/modules/comments/dto/update.comment.dto';

export default class UpdateCommentUseCaseDto extends UpdateCardCommentDto {
	completionHandler: () => void;
}
