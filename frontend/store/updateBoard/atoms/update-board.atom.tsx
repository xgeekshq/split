import { atom } from 'recoil';

export const updateBoardError = atom({
	key: 'haveUpdateBoardError',
	default: false
});

// export const createBoardState = atom({
// 	key: 'showCreateBoard',
// 	default: false
// });

export interface UpdateBoardData {
	board: {
		hideVotes: boolean;
		title: string;
		maxVotes: undefined | string;
		postAnonymously: boolean;
	};
}

export const updateBoardDataState = atom<UpdateBoardData>({
	key: 'updateBoardData',
	default: {
		board: {
			title: '',
			maxVotes: undefined,
			hideVotes: false,
			postAnonymously: false
		}
	}
});
