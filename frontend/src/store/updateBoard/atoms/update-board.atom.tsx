import { atom } from 'recoil';

import { BoardUser } from 'types/board/board.user';

export const updateBoardError = atom({
	key: 'haveUpdateBoardError',
	default: false
});

export interface UpdateBoardData {
	board: {
		_id: string;
		hideCards: boolean;
		hideVotes: boolean;
		title: string;
		maxVotes: undefined | string;
		postAnonymously: boolean;
		users: BoardUser[];
	};
}

export const updateBoardDataState = atom<UpdateBoardData>({
	key: 'updateBoardData',
	default: {
		board: {
			_id: '',
			title: '',
			hideCards: false,
			hideVotes: false,
			maxVotes: undefined,
			postAnonymously: false,
			users: []
		}
	}
});
