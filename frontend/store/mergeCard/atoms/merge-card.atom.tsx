import { atom } from 'recoil';

import MergeCardsDto from '../../../types/board/mergeCard.dto';

export const mergeCardState = atom<MergeCardsDto | undefined>({
	key: 'mergingCard',
	default: undefined
});
