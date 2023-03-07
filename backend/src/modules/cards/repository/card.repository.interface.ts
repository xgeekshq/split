import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';
import CardItem from '../entities/card.item.schema';
import Card from '../entities/card.schema';

export interface CardRepositoryInterface extends BaseInterfaceRepository<Board> {
	getCardFromBoard(boardId: string, cardId: string): Promise<Card[]>;
	getCardItemFromGroup(boardId: string, cardItemId: string): Promise<CardItem[]>;
}
