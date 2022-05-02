import { useCallback, useMemo } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { createBoardDataState } from "../store/createBoard/atoms/create-board.atom";
import { BoardToAdd } from "../types/board/board";
import { BoardUserToAdd } from "../types/board/board.user";
import { Team } from "../types/team/team";
import { BoardUserRoles } from "../utils/enums/board.user.roles";
import { TeamUser } from "../types/team/team.user";
import { getStakeholders } from "../api/boardService";

const useCreateBoard = (team: Team) => {
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);
  const resetBoardState = useResetRecoilState(createBoardDataState);

  const { data: stakeHolders } = useQuery("/boards/stakeholders", () => getStakeholders());

  const { board } = createBoardData;

  const minTeams = 2;

  // const now = new Date();
  // const last3Months = new Date().setMonth(now.getMonth() - 3);

  const teamMembers = team.users.filter(
    (teamUser) =>
      !stakeHolders?.includes(teamUser.user.email) && new Date(teamUser.user.joinedAt).getTime() > 0
  );
  const dividedBoardsCount = board.dividedBoards.length;

  const generateSubBoard = useCallback(
    (index: number, users: BoardUserToAdd[] = []): BoardToAdd => {
      return {
        title: `Sub-team board ${index}`,
        columns: [
          { title: "Went well", color: "$highlight1Light", cards: [] },
          { title: "To improve", color: "$highlight4Light", cards: [] },
          { title: "Action points", color: "$highlight3Light", cards: [] },
        ],
        isPublic: false,
        dividedBoards: [],
        recurrent: false,
        users,
        team: null,
        isSubBoard: true,
        maxVotes: undefined,
        hideCards: false,
        hideVotes: false,
        postAnonymously: false,
      };
    },
    []
  );

  const getRandomUser = useCallback(
    (list: TeamUser[]) => list[Math.floor(Math.random() * list.length)],
    []
  );

  const handleSplitBoards = useCallback(
    (maxTeams: number) => {
      const subBoards: BoardToAdd[] = [];
      const splitedUsers: BoardUserToAdd[][] = new Array(maxTeams).fill([]);

      let availableUsers = [...teamMembers];

      for (let i = 0, j = 0; i < teamMembers.length; i++, j++) {
        const teamUser = getRandomUser(availableUsers);

        if (j >= maxTeams) j = 0;
        splitedUsers[j] = [
          ...splitedUsers[j],
          {
            user: teamUser.user,
            role: BoardUserRoles.MEMBER,
            votesCount: 0,
          },
        ];

        availableUsers = availableUsers.filter((user) => user.user._id !== teamUser.user._id);
      }

      new Array(maxTeams).fill(0).forEach((_, i) => {
        const newBoard = generateSubBoard(i + 1);
        splitedUsers[i][Math.floor(Math.random() * splitedUsers[i].length)].role =
          BoardUserRoles.RESPONSIBLE;
        newBoard.users = splitedUsers[i];
        subBoards.push(newBoard);
      });
      return subBoards;
    },
    [generateSubBoard, getRandomUser, teamMembers]
  );

  const canAdd = useMemo(() => {
    if (dividedBoardsCount === Math.floor(teamMembers.length / 2)) {
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
    stakeHolders,
    resetBoardState,
  };
};

export default useCreateBoard;
