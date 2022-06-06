export default interface UpdateCardPositionDto {
	colIdOfCard: string;
	targetColumnId: string;
	newPosition: number;
	cardPosition: number;
	boardId: string;
	cardId: string;
	socketId: string;
}
