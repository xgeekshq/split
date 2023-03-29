import Card from '../../entities/card.schema';

export interface DeleteCardServiceInterface {
	delete(boardId: string, cardId: string): Promise<void>;

	deleteFromCardGroup(boardId: string, cardId: string, cardItemId: string): Promise<void>;

	deleteCardVotesFromColumn(boardId: string, cards: Card[]): Promise<void>;
}
