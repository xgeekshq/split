import { atom } from 'recoil';

import { BoardToAdd } from '@/types/board/board';
import { BoardUserDto } from '@/types/board/board.user';
import { Team } from '@/types/team/team';

export const createBoardError = atom({
  key: 'haveCreateBoardError',
  default: false,
});

export const createBoardState = atom({
  key: 'showCreateBoard',
  default: false,
});

export const createBoardTeam = atom<Team | undefined>({
  key: 'createBoardTeam',
  default: undefined,
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
      columns: [
        {
          title: 'Went well',
          color: '$highlight1Light',
          cards: [],
          isDefaultText: true,
          cardText: 'Write your comment here...',
        },
        {
          title: 'To improve',
          color: '$highlight4Light',
          cards: [],
          isDefaultText: true,
          cardText: 'Write your comment here...',
        },
        {
          title: 'Action points',
          color: '$highlight3Light',
          cards: [],
          isDefaultText: true,
          cardText: 'Write your comment here...',
        },
      ],
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
    },
  },
});
