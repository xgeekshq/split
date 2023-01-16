import CardDto from '../../dto/card.dto';
import Card from '../../schemas/card.schema';

export interface CreateCardApplication {
	create(
		boardId: string,
		userId: string,
		card: CardDto,
		colIdToAdd: string
	): Promise<{
		newCard: Card;
		hideCards: boolean;
		hideVotes: boolean;
	}>;
}
