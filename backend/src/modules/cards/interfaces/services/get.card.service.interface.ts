import CardItem from 'src/modules/cards/schemas/card.item.schema';
import Card from '../../schemas/card.schema';

export interface GetCardServiceInterface {
	getCardFromBoard(boardId: string, cardId: string): Promise<Card | null>;

	getCardItemFromGroup(boardId: string, cardItemId: string): Promise<CardItem | Card> | null;
}
