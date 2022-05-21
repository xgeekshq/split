export default interface DeleteCommentDto {
	cardId: string;
	cardItemId?: string;
	commentId: string;
	boardId: string;
	socketId?: string;
	isCardGroup: boolean;
}
