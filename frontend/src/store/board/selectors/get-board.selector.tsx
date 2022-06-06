import { selector } from 'recoil';

import { boardState } from '../atoms/board.atom';

export const getBoardSelector = selector({
	key: 'getBoard', // unique ID (with respect to other atoms/selectors)
	get: ({ get }) => {
		return get(boardState);
	}
});
