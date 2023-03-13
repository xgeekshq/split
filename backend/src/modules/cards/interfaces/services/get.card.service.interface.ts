import CardItem from 'src/modules/cards/entities/card.item.schema';
import Card from '../../entities/card.schema';

export interface GetCardServiceInterface {
	getCardFromBoard(boardId: string, cardId: string): Promise<Card | null>;

	getCardItemFromGroup(boardId: string, cardItemId: string): Promise<CardItem | Card> | null;
}
