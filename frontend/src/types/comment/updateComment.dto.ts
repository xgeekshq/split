export default interface UpdateCommentDto {
	cardId: string;
	cardItemId?: string;
	commentId: string;
	text: string;
	boardId: string;
	socketId?: string;
	isCardGroup: boolean;
}
