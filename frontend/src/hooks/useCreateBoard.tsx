import { useCallback, useMemo } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import { defaultColumns } from '@/helper/board/defaultColumns';
import { createBoardDataState } from '../store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from '../types/board/board';
import { BoardUserToAdd } from '../types/board/board.user';
import { Team } from '../types/team/team';
import { TeamUser } from '../types/team/team.user';
import { BoardUserRoles } from '../utils/enums/board.user.roles';

const useCreateBoard = (team?: Team) => {
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);
  const resetBoardState = useResetRecoilState(createBoardDataState);

  const { board } = createBoardData;

  const minTeams = 2;
  const MIN_MEMBERS = 4;

  const teamMembers = team?.users.filter((teamUser) => teamUser.role !== TeamUserRoles.STAKEHOLDER);
  const teamMembersLength = teamMembers?.length ?? 0;
  const dividedBoardsCount = board.dividedBoards.length;

  const generateSubBoard = useCallback(
    (index: number, users: BoardUserToAdd[] = []): BoardToAdd => ({
      title: `Sub-team board ${index}`,
      columns: defaultColumns,
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
      addCards: true,
    }),
    [],
  );

  const getRandomUser = useCallback(
    (list: TeamUser[]) => list.splice(Math.floor(Math.random() * list.length), 1)[0],
    [],
  );

  const generateSubBoards = useCallback(
    (maxTeams: number, splitUsers: BoardUserToAdd[][], subBoards: BoardToAdd[]) => {
      if (splitUsers && (team?.users.length ?? 0) >= MIN_MEMBERS) {
        new Array(maxTeams).fill(0).forEach((_, i) => {
          const newBoard = generateSubBoard(i + 1);
          const teamUsersWotIsNewJoiner = splitUsers[i].filter((user) => !user.isNewJoiner);

          teamUsersWotIsNewJoiner[Math.floor(Math.random() * teamUsersWotIsNewJoiner.length)].role =
            BoardUserRoles.RESPONSIBLE;

          const result = splitUsers[i].map(
            (user) =>
              teamUsersWotIsNewJoiner.find((member) => member.user._id === user.user._id) || user,
          ) as BoardUserToAdd[];

          newBoard.users = result;
          subBoards.push(newBoard);
        });
      }
    },
    [generateSubBoard, team],
  );

  const sortUsersListByOldestCreatedDate = (users: TeamUser[]) =>
    users
      .map((user) => ({
        ...user,
        userCreated: user.user.providerAccountCreatedAt || user.user.joinedAt,
      }))
      .sort((a, b) => Number(b.userCreated) - Number(a.userCreated));

  const getAvailableUsersToBeResponsible = useCallback((availableUsers: TeamUser[]) => {
    const availableUsersListSorted = sortUsersListByOldestCreatedDate(availableUsers);

    // returns the user who has the oldest account date
    return availableUsersListSorted.slice(0, 1).map((user) => {
      user.isNewJoiner = false;
      return user;
    });
  }, []);

  const getRandomGroup = useCallback(
    (usersPerTeam: number, availableUsers: TeamUser[]) => {
      const randomGroupOfUsers = [];

      let availableUsersToBeResponsible = availableUsers.filter((user) => !user.isNewJoiner);

      if (availableUsersToBeResponsible.length < 1) {
        availableUsersToBeResponsible = getAvailableUsersToBeResponsible(availableUsers);
      }

      // this object ensures that each group has one element that can be responsible
      const candidateToBeTeamResponsible = getRandomUser(availableUsersToBeResponsible);

      randomGroupOfUsers.push({
        user: candidateToBeTeamResponsible.user,
        role: BoardUserRoles.MEMBER,
        votesCount: 0,
        isNewJoiner: candidateToBeTeamResponsible.isNewJoiner,
        _id: candidateToBeTeamResponsible._id,
      });

      const availableUsersWotResponsible = availableUsers.filter(
        (user) => user.user._id !== candidateToBeTeamResponsible.user._id,
      );

      let i = 0;

      // adds the rest of the elements of each group
      while (i < usersPerTeam - 1) {
        const teamUser = getRandomUser(availableUsersWotResponsible);

        randomGroupOfUsers.push({
          user: teamUser.user,
          role: BoardUserRoles.MEMBER,
          votesCount: 0,
          isNewJoiner: teamUser.isNewJoiner,
          _id: teamUser._id,
        });
        i++;
      }
      return randomGroupOfUsers;
    },
    [getAvailableUsersToBeResponsible, getRandomUser],
  );

  const handleSplitBoards = useCallback(
    (maxTeams: number) => {
      if (!teamMembers) {
        return [];
      }
      const subBoards: BoardToAdd[] = [];
      const splitUsers: BoardUserToAdd[][] = new Array(maxTeams).fill([]);

      let availableUsers = [...teamMembers];

      const isNotNewJoiners = availableUsers.filter((user) => !user.isNewJoiner);
      const responsiblesAvailable: TeamUser[] = [];
      while (isNotNewJoiners.length > 0 && responsiblesAvailable.length !== maxTeams) {
        const idx = Math.floor(Math.random() * isNotNewJoiners.length);
        const randomUser = isNotNewJoiners[idx];
        if (randomUser && !responsiblesAvailable.includes(randomUser)) {
          responsiblesAvailable.push(randomUser);
          isNotNewJoiners.splice(idx, 1);
        }
      }

      availableUsers = availableUsers.filter((user) => !responsiblesAvailable.includes(user));

      const usersPerTeam = Math.floor(teamMembersLength / maxTeams);
      let leftOverUsers = teamMembersLength % maxTeams;

      new Array(maxTeams).fill(0).forEach((_, i) => {
        if (responsiblesAvailable.length > 0) {
          const removedUser = responsiblesAvailable.shift();
          if (removedUser) {
            availableUsers.push(removedUser);
          }
        }

        const numberOfUsersByGroup = leftOverUsers-- > 0 ? usersPerTeam + 1 : usersPerTeam;

        splitUsers[i] = getRandomGroup(numberOfUsersByGroup, availableUsers);

        availableUsers = availableUsers.filter(
          (user) => !splitUsers[i].some((member) => member.user._id === user.user._id),
        );
      });

      generateSubBoards(maxTeams, splitUsers, subBoards);

      return subBoards;
    },
    [generateSubBoards, getRandomGroup, teamMembers, teamMembersLength],
  );

  const canAdd = useMemo(() => {
    if (
      dividedBoardsCount === teamMembersLength ||
      dividedBoardsCount === Math.floor(teamMembersLength / 2)
    ) {
      return false;
    }
    return true;
  }, [dividedBoardsCount, teamMembersLength]);

  const canReduce = useMemo(() => {
    if (dividedBoardsCount <= minTeams) {
      return false;
    }
    return true;
  }, [dividedBoardsCount, minTeams]);

  const handleAddTeam = () => {
    if (!canAdd) return;
    const countUsers = (teamMembersLength / (dividedBoardsCount + 1)).toFixed(0);

    setCreateBoardData((prev) => ({
      ...prev,
      count: {
        ...prev.count,
        maxUsersCount: Number(countUsers),
        teamsCount: dividedBoardsCount + 1,
      },
      board: {
        ...prev.board,
        dividedBoards: handleSplitBoards(dividedBoardsCount + 1),
      },
    }));
  };

  const handleRemoveTeam = () => {
    if (!canReduce) return;
    const countUsers = (teamMembersLength / (dividedBoardsCount - 1)).toFixed(0);

    setCreateBoardData((prev) => ({
      ...prev,
      count: {
        ...prev.count,
        maxUsersCount: Number(countUsers),
        teamsCount: dividedBoardsCount - 1,
      },
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
