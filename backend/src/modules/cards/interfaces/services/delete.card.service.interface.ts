import Card from '../../entities/card.schema';

export interface DeleteCardServiceInterface {
	deleteCardVotesFromColumn(boardId: string, cards: Card[]): Promise<void>;
}
