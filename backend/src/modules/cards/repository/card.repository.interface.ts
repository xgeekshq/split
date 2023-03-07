import { UpdateResult } from 'mongodb';
import {
	BaseInterfaceRepository,
	PopulateType
} from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';
import Comment from 'src/modules/comments/schemas/comment.schema';
import CardDto from '../dto/card.dto';
import CardItem from '../entities/card.item.schema';
import Card from '../entities/card.schema';

export interface CardRepositoryInterface extends BaseInterfaceRepository<Board> {
	/*Card */
	getCardFromBoard(boardId: string, cardId: string): Promise<Card[]>;

	updateCardGroupText(
		boardId: string,
		cardId: string,
		userId: string,
		text: string
	): Promise<Board>;

	updateCardFromGroupOnUnmerge(
		boardId: string,
		cardGroupId: string,
		cardItem: CardItem,
		newComments: Comment[],
		newVotes: string[],
		withSession?: boolean
	): Promise<Board>;

	updateCardOnMerge(
		boardId: string,
		cardId: string,
		newItems: CardItem[],
		newVotes: string[],
		newComments: Comment[],
		withSession?: boolean
	): Promise<Board>;

	pullCard(boardId: string, cardId: string, session?: boolean): Promise<UpdateResult>;

	pushCard(
		boardId: string,
		columnId: string,
		position: number,
		card: Card | CardDto,
		withSession?: boolean,
		populate?: PopulateType
	): Promise<Board>;

	/*CardItem */
	getCardItemFromGroup(boardId: string, cardItemId: string): Promise<CardItem[]>;

	updateCardText(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string,
		text: string
	): Promise<Board>;

	pullItem(boardId: string, itemId: string, session?: boolean): Promise<UpdateResult>;
}
