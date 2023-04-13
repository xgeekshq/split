import CardItem from 'src/modules/cards/entities/card.item.schema';
import Card from 'src/modules/cards/entities/card.schema';

export interface DeleteVoteServiceInterface {
	decrementVoteUser(
		boardId: string,
		userId: string,
		count?: number | undefined,
		withSession?: boolean
	): Promise<void>;

	canUserDeleteVote(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		cardItemId?: string
	): Promise<void>;

	verifyIfUserCanDeleteVote(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		cardItemId?: string
	): Promise<boolean>;

	removeVotesFromCardItem(
		boardId: string,
		cardItemId: string,
		votes: string[],
		cardId: string,
		withSession?: boolean
	): Promise<void>;

	getCardItemFromBoard(boardId: string, cardId: string, cardItemId?: string): Promise<CardItem>;

	getCardFromBoard(boardId: string, cardId: string): Promise<Card>;

	deleteCardVotesFromColumn(boardId: string, cardsArray: Card[]): Promise<void>;
}
