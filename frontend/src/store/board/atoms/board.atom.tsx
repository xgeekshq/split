import { atom } from 'recoil';

import BoardType, { BoardInfoType } from '@/types/board/board';
import { BoardUser } from '@/types/board/board.user';
import ColumnType, { CreateColumn } from '@/types/column';

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

export const deletedColumnsState = atom<string[]>({
  key: 'deletedColumns',
  default: [],
});
