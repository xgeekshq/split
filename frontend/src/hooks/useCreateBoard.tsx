import { useCallback, useMemo } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { createBoardDataState } from '../store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from '../types/board/board';
import { BoardUserToAdd } from '../types/board/board.user';
import { Team } from '../types/team/team';
import { TeamUser } from '../types/team/team.user';
import { BoardUserRoles } from '../utils/enums/board.user.roles';

const useCreateBoard = (team: Team) => {
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);
  const resetBoardState = useResetRecoilState(createBoardDataState);

  const { board } = createBoardData;

  const minTeams = 2;
  const MIN_MEMBERS = 4;

  const teamMembers = team.users.filter((teamUser) => teamUser.role !== TeamUserRoles.STAKEHOLDER);

  const dividedBoardsCount = board.dividedBoards.length;

  const generateSubBoard = useCallback(
    (index: number, users: BoardUserToAdd[] = []): BoardToAdd => ({
      title: `Sub-team board ${index}`,
      columns: [
        { title: 'Went well', color: '$highlight1Light', cards: [] },
        { title: 'To improve', color: '$highlight4Light', cards: [] },
        { title: 'Action points', color: '$highlight3Light', cards: [] },
      ],
      isPublic: false,
      dividedBoards: [],
      recurrent: false,
      users,
      team: null,
      isSubBoard: false,
      boardNumber: index,
      maxVotes: undefined,
      hideCards: false,
      hideVotes: false,
      totalUsedVotes: 0,
    }),
    [],
  );

  const getRandomUser = useCallback(
    (list: TeamUser[]) => list.splice(Math.floor(Math.random() * list.length), 1)[0],
    [],
  );

  const generateSubBoards = useCallback(
    (maxTeams: number, splitUsers: BoardUserToAdd[][], subBoards: BoardToAdd[]) => {
      if (splitUsers && team.users.length >= MIN_MEMBERS) {
        new Array(maxTeams).fill(0).forEach((_, i) => {
          const newBoard = generateSubBoard(i + 1);
          const teamUsersWotIsNewJoiner = splitUsers[i].filter((user) => !user.isNewJoiner);

          teamUsersWotIsNewJoiner[Math.floor(Math.random() * teamUsersWotIsNewJoiner.length)].role =
            BoardUserRoles.RESPONSIBLE;

          const result = splitUsers[i].map(
            (user) => teamUsersWotIsNewJoiner.find((member) => member._id === user._id) || user,
          ) as BoardUserToAdd[];

          newBoard.users = result;
          subBoards.push(newBoard);
        });
      }
    },
    [generateSubBoard, team],
  );

  const handleSplitBoards = useCallback(
    (maxTeams: number) => {
      const subBoards: BoardToAdd[] = [];
      const splitUsers: BoardUserToAdd[][] = new Array(maxTeams).fill([]);

      const availableUsers = [...teamMembers];

      new Array(teamMembers.length).fill(0).reduce((j) => {
        if (j >= maxTeams) j = 0;
        const teamUser = getRandomUser(availableUsers);

        splitUsers[j] = [
          ...splitUsers[j],
          {
            user: teamUser.user,
            role: BoardUserRoles.MEMBER,
            votesCount: 0,
            isNewJoiner: teamUser.isNewJoiner,
            _id: teamUser._id,
          },
        ];
        return ++j;
      }, 0);

      generateSubBoards(maxTeams, splitUsers, subBoards);

      return subBoards;
    },
    [generateSubBoards, getRandomUser, teamMembers],
  );

  const canAdd = useMemo(() => {
    if (
      dividedBoardsCount === teamMembers.length ||
      dividedBoardsCount === Math.floor(teamMembers.length / 2)
    ) {
      return false;
    }
    return true;
  }, [dividedBoardsCount, teamMembers.length]);

  const canReduce = useMemo(() => {
    if (dividedBoardsCount <= minTeams) {
      return false;
    }
    return true;
  }, [dividedBoardsCount, minTeams]);

  const handleAddTeam = () => {
    if (!canAdd) return;
    const countUsers = Math.ceil(teamMembers.length / (dividedBoardsCount + 1));

    setCreateBoardData((prev) => ({
      ...prev,
      count: { ...prev.count, maxUsersCount: countUsers, teamsCount: dividedBoardsCount + 1 },
      board: {
        ...prev.board,
        dividedBoards: handleSplitBoards(dividedBoardsCount + 1),
      },
    }));
  };

  const handleRemoveTeam = () => {
    if (!canReduce) return;
    const countUsers = Math.ceil(teamMembers.length / (dividedBoardsCount - 1));
    setCreateBoardData((prev) => ({
      ...prev,
      count: { ...prev.count, maxUsersCount: countUsers, teamsCount: dividedBoardsCount - 1 },
      board: {
        ...prev.board,
        dividedBoards: handleSplitBoards(dividedBoardsCount - 1),
      },
    }));
  };

  return {
    createBoardData,
    setCreateBoardData,
    handleAddTeam,
    handleRemoveTeam,
    canAdd,
    canReduce,
    generateSubBoard,
    handleSplitBoards,
    teamMembers,
    resetBoardState,
  };
};

export default useCreateBoard;
