import { atom } from 'recoil';

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
			maxVotes: undefined
		}
	}
});
