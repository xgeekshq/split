import { atom } from 'recoil';

import BoardType, { BoardInfoType } from 'types/board/board';

export const boardState = atom<BoardType | undefined>({
	key: 'board',
	default: undefined
});

export const boardInfoState = atom<BoardInfoType>({
	key: 'boardInfo',
	default: undefined
});

export const newBoardState = atom<BoardType | undefined>({
	key: 'newBoard',
	default: undefined
});
