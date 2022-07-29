import { atom } from 'recoil';

import { UpdateBoardType } from 'types/board/board';

export const updateBoardError = atom({
	key: 'haveUpdateBoardError',
	default: false
});

export const updateBoardDataState = atom<{ board: UpdateBoardType }>({
	key: 'updateBoardData',
	default: {
		board: {
			_id: '',
			title: '',
			hideCards: false,
			hideVotes: false,
			maxVotes: undefined,
			users: []
		}
	}
});
