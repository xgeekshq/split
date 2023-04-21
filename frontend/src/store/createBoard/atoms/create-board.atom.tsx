import { atom } from 'recoil';

import { defaultSplitColumns } from '@/constants/boards/defaultColumns';
import { BoardToAdd } from '@/types/board/board';
import { BoardUserDto } from '@/types/board/board.user';
import { Team } from '@/types/team/team';

export const createBoardError = atom({
  key: 'haveCreateBoardError',
  default: false,
});

export interface CreateBoardData {
  count: {
    teamsCount: number;
    maxUsersCount: number;
  };

  board: BoardToAdd;
  team: Team | null;
  users: BoardUserDto[];
}

export const createBoardDataState = atom<CreateBoardData>({
  key: 'createBoardData',
  default: {
    users: [],
    team: null,
    count: {
      teamsCount: 2,
      maxUsersCount: 2,
    },
    board: {
      title: 'Main Board -',
      columns: defaultSplitColumns,
      isPublic: false,
      maxVotes: undefined,
      dividedBoards: [],
      recurrent: true,
      users: [],
      team: null,
      isSubBoard: false,
      boardNumber: 0,
      hideCards: false,
      hideVotes: false,
      slackEnable: false,
      addCards: true,
      postAnonymously: false,
    },
  },
});
