export default interface ExchangeCardGroupDto {
	cardGroupIdOfCard?: string;

	targetCardGroupId: string;

	draggedCardId: string;

	boardId: string;

	socketId?: string;
}
