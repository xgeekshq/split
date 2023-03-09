import { BoardTimer } from './board-timer.repository';

export interface BoardTimerRepositoryInterface {
	getOrCreateBoardTimer(boardId: string, clientId: string): BoardTimer;
	findBoardTimerByBoardId(boardId: string): BoardTimer | null;
	removeTimer(boardId: string): void;
}
