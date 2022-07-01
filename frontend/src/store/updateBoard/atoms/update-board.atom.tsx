import { atom } from 'recoil';

export const updateBoardError = atom({
	key: 'haveUpdateBoardError',
	default: false
});

export interface UpdateBoardData {
	board: {
		_id: string;
		hideVotes: boolean;
		title: string;
		maxVotes: undefined | string;
		postAnonymously: boolean;
		hideCards: boolean;
	};
}

export const updateBoardDataState = atom<UpdateBoardData>({
	key: 'updateBoardData',
	default: {
		board: {
			_id: '',
			title: '',
			maxVotes: undefined,
			hideVotes: false,
			postAnonymously: false,
			hideCards: false
		}
	}
});
