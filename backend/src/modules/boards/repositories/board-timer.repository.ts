import { Injectable } from '@nestjs/common';
import TimerHelper from 'src/modules/boards/helpers/timer.helper';

type BoardTimer = {
	boardId: string;
	clientId: string;
	timerHelper: TimerHelper;
};

@Injectable()
export default class BoardTimerRepository {
	boardTimers: BoardTimer[] = [];

	getOrCreateBoardTimer(boardId: string, clientId: string): BoardTimer {
		const boardTimerFound = this.findBoardTimerByBoardId(boardId);

		if (boardTimerFound) {
			return boardTimerFound;
		}

		return this.createTimer(boardId, clientId);
	}

	private createTimer(boardId: string, clientId: string) {
		const timerHelper = new TimerHelper();
		const newBoardTimer = { boardId, clientId, timerHelper };
		this.boardTimers.push(newBoardTimer);

		return newBoardTimer;
	}

	findBoardTimerByBoardId(boardId: string): BoardTimer | null {
		const found = this.boardTimers.find((boardTimer) => boardTimer.boardId === boardId);

		return found;
	}

	removeTimer(boardId: string): void {
		const boardTimerIndex = this.boardTimers.findIndex(
			(boardTimer) => boardTimer.boardId === boardId
		);

		if (boardTimerIndex > -1) {
			this.boardTimers[boardTimerIndex].timerHelper.stop();
			this.boardTimers.splice(boardTimerIndex, 1);
		}
	}
}
