export default interface UpdateCardDto {
	cardId: string;

	cardItemId: string;

	text: string;

	boardId: string;

	socketId?: string;

	isCardGroup: boolean;
}
