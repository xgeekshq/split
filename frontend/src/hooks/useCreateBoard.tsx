import { useCallback, useMemo } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { createBoardDataState } from '../store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from '../types/board/board';
import { BoardUserToAdd } from '../types/board/board.user';
import { Team } from '../types/team/team';
import { TeamUser } from '../types/team/team.user';
import { BoardUserRoles } from '../utils/enums/board.user.roles';

const useCreateBoard = (team: Team, stakeHolders: string[]) => {
	const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);
	const resetBoardState = useResetRecoilState(createBoardDataState);

	const { board } = createBoardData;

	const minTeams = 2;
	const minMembers = 4;

	// const now = new Date();
	// const last3Months = new Date().setMonth(now.getMonth() - 3);

	const teamMembers = team.users.filter(
		(teamUser) =>
			!stakeHolders?.includes(teamUser.user.email) &&
			new Date(teamUser.user.joinedAt).getTime() > 0
	);
	const dividedBoardsCount = board.dividedBoards.length;

	const generateSubBoard = useCallback(
		(index: number, users: BoardUserToAdd[] = []): BoardToAdd => {
			return {
				title: `Sub-team board ${index}`,
				columns: [
					{ title: 'Went well', color: '$highlight1Light', cards: [] },
					{ title: 'To improve', color: '$highlight4Light', cards: [] },
					{ title: 'Action points', color: '$highlight3Light', cards: [] }
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
				postAnonymously: false
			};
		},
		[]
	);

	const getRandomUser = useCallback(
		(list: TeamUser[]) => list.splice(Math.floor(Math.random() * list.length), 1)[0],
		[]
	);

	const generateSubBoards = useCallback(
		(maxTeams: number, splitedUsers: BoardUserToAdd[][], subBoards: BoardToAdd[]) => {
			if (splitedUsers && team.users.length >= minMembers) {
				new Array(maxTeams).fill(0).forEach((_, i) => {
					const newBoard = generateSubBoard(i + 1);
					console.log(splitedUsers);
					splitedUsers[i][Math.floor(Math.random() * splitedUsers[i].length)].role =
						BoardUserRoles.RESPONSIBLE;
					newBoard.users = splitedUsers[i];
					subBoards.push(newBoard);
				});
			}
		},
		[generateSubBoard]
	);

	const handleSplitBoards = useCallback(
		(maxTeams: number) => {
			const subBoards: BoardToAdd[] = [];
			const splitedUsers: BoardUserToAdd[][] = new Array(maxTeams).fill([]);

			const availableUsers = [...teamMembers];

			new Array(teamMembers.length).fill(0).reduce((j) => {
				if (j >= maxTeams) j = 0;
				const teamUser = getRandomUser(availableUsers);
				splitedUsers[j] = [
					...splitedUsers[j],
					{ user: teamUser.user, role: BoardUserRoles.MEMBER, votesCount: 0 }
				];
				return ++j;
			}, 0);

			generateSubBoards(maxTeams, splitedUsers, subBoards);

			return subBoards;
		},
		[generateSubBoards, getRandomUser, teamMembers]
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
				dividedBoards: handleSplitBoards(dividedBoardsCount + 1)
			}
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
				dividedBoards: handleSplitBoards(dividedBoardsCount - 1)
			}
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
		resetBoardState
	};
};

export default useCreateBoard;
