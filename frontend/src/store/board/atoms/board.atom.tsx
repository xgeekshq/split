import { atom } from 'recoil';

import BoardType, { BoardInfoType } from '@/types/board/board';
import ColumnType, { CreateColumn } from '@/types/column';
import { BoardUser } from '@/types/board/board.user';

export const boardState = atom<BoardType | undefined>({
  key: 'board',
  default: undefined,
});

export const boardInfoState = atom<BoardInfoType>({
  key: 'boardInfo',
  default: undefined,
});

export const newBoardState = atom<string | undefined>({
  key: 'newBoard',
  default: undefined,
});

export const filterTeamBoardsState = atom<string>({
  key: 'filterTeamBoards',
  default: 'all',
});

export const editColumnsState = atom<(ColumnType | CreateColumn)[]>({
  key: 'editColumns',
  default: [],
});

export const boardParticipantsState = atom<BoardUser[]>({
  key: 'boardParticipants',
  default: [],
});
