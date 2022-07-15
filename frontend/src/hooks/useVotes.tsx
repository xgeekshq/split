import { QueryClient, useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

import { addVoteRequest, deleteVoteRequest } from 'api/boardService';
import voteDto from 'types/vote/vote.dto';
import { ToastStateEnum } from 'utils/enums/toast-types';
import isEmpty from 'utils/isEmpty';
import BoardType from '../types/board/board';
import { getRemainingVotes } from '../utils/getRemainingVotes';
import useBoardUtils from './useBoardUtils';

type ActionType = 'add' | 'remove';

const getNewOptimisticBoardData = (
	action: ActionType,
	prevBoardData: BoardType,
	cardItemIndexes: number[],
	userId: string
) => {
	const [colIdx, cardIdx, cardItemIdx] = cardItemIndexes;
	if (action === 'add') {
		prevBoardData.columns[colIdx].cards[cardIdx].items[cardItemIdx].votes.push(userId);
	} else if (action === 'remove') {
		prevBoardData.columns[colIdx].cards[cardIdx].items[cardItemIdx].votes.pop();
	}
	return prevBoardData;
};

const optimisticUpdateBoardData = (
	action: ActionType,
	prevBoardData: BoardType,
	voteData: voteDto,
	userId = ''
) => {
	let [colIdx, cardIdx, cardItemIdx] = [-1, -1, -1];

	const foundCordItem = prevBoardData.columns.some((column, idxCol) =>
		column.cards.some(
			(card, idxCard) =>
				card._id === voteData.cardId &&
				card.items.some((cardItem, idxCardItem) => {
					if (cardItem._id === voteData.cardItemId) {
						[colIdx, cardIdx, cardItemIdx] = [idxCol, idxCard, idxCardItem];
						return true;
					}
					return false;
				})
		)
	);

	if (foundCordItem) {
		return getNewOptimisticBoardData(
			action,
			prevBoardData,
			[colIdx, cardIdx, cardItemIdx],
			userId
		);
	}

	return prevBoardData;
};

const getPreviousBoardData = async (
	queryClient: QueryClient,
	boardQueryKey: (string | { id: string })[]
) => {
	await queryClient.cancelQueries(boardQueryKey);

	const boardDataOnQuery: any = queryClient.getQueryData(boardQueryKey);
	const prevBoardData: BoardType = JSON.parse(JSON.stringify({ ...boardDataOnQuery.board }));

	return prevBoardData;
};

const optimisticUpdateVote = async (
	action: ActionType,
	queryClient: QueryClient,
	boardQueryKey: (string | { id: string })[],
	voteData: voteDto,
	userId: string | undefined
) => {
	const prevBoardData: BoardType = await getPreviousBoardData(queryClient, boardQueryKey);

	const newBoardData = optimisticUpdateBoardData(action, prevBoardData, voteData, userId);

	queryClient.setQueryData(boardQueryKey, { board: newBoardData });

	return newBoardData;
};

const optimisticAddVote = async (
	queryClient: QueryClient,
	boardQueryKey: (string | { id: string })[],
	voteData: voteDto,
	userId: string | undefined
) => optimisticUpdateVote('add', queryClient, boardQueryKey, voteData, userId);

const optimisticRemoveVote = async (
	queryClient: QueryClient,
	boardQueryKey: (string | { id: string })[],
	voteData: voteDto
) => optimisticUpdateVote('remove', queryClient, boardQueryKey, voteData, undefined);

const useVotes = () => {
	const { queryClient, setToastState } = useBoardUtils();
	const { data: session } = useSession({ required: true });
	const userId = session?.user?.id;

	const addVote = useMutation(addVoteRequest, {
		onMutate: async (voteData) => {
			const boardQueryKey = ['board', { id: voteData.boardId }];

			const prevBoardData: BoardType = await optimisticAddVote(
				queryClient,
				boardQueryKey,
				voteData,
				userId
			);

			return { prevBoardData };
		},
		onSettled: (boardDataFromApi) => {
			queryClient.invalidateQueries(['board', { id: boardDataFromApi?._id }]);

			if (boardDataFromApi && !isEmpty(boardDataFromApi.maxVotes)) {
				setToastState({
					open: true,
					content: `You have ${getRemainingVotes(boardDataFromApi, userId!)} votes left`,
					type: ToastStateEnum.INFO
				});
			}
		},
		onError: (_err, voteData, ctx) => {
			queryClient.setQueryData(['board', { id: voteData.boardId }], ctx?.prevBoardData);

			setToastState({
				open: true,
				content: 'Error adding the vote',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const deleteVote = useMutation(deleteVoteRequest, {
		onMutate: async (voteData) => {
			const boardQueryKey = ['board', { id: voteData.boardId }];

			const prevBoardData: BoardType = await optimisticRemoveVote(
				queryClient,
				boardQueryKey,
				voteData
			);
			return { prevBoardData };
		},
		onSettled: (boardDataFromApi) => {
			queryClient.invalidateQueries(['board', { id: boardDataFromApi?._id }]);

			if (boardDataFromApi && !isEmpty(boardDataFromApi.maxVotes)) {
				setToastState({
					open: true,
					content: `Vote removed. You have ${getRemainingVotes(
						boardDataFromApi,
						userId!
					)} votes left.`,
					type: ToastStateEnum.INFO
				});
			}
		},
		onError: (_err, voteData, ctx) => {
			queryClient.setQueryData(['board', { id: voteData.boardId }], ctx?.prevBoardData);

			setToastState({
				open: true,
				content: 'Error deleting the vote',
				type: ToastStateEnum.ERROR
			});
		}
	});

	return {
		addVote,
		deleteVote
	};
};

export default useVotes;
