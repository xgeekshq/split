import { QueryClient, useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

import { addVoteRequest, deleteVoteRequest } from 'api/boardService';
import { CardItemType } from 'types/card/cardItem';
import voteDto from 'types/vote/vote.dto';
import { ToastStateEnum } from 'utils/enums/toast-types';
import isEmpty from 'utils/isEmpty';
import BoardType from '../types/board/board';
import { getRemainingVotes } from '../utils/getRemainingVotes';
import useBoardUtils from './useBoardUtils';

enum Action {
	Add = 'add',
	Remove = 'remove'
}

type QueryKeyType = (string | { id: string })[];

type ToastStateType = {
	open: boolean;
	type: ToastStateEnum;
	content: string;
};

const shallAddVote = (action: Action) => action === Action.Add;

const shallRemoveVote = (action: Action) => action === Action.Remove;

const getBoardQueryKey = (boardId = ''): QueryKeyType => ['board', { id: boardId }];

const hasMaxVotesLimit = ({ maxVotes }: BoardType) => !isEmpty(maxVotes);

const getFirstCardItemIndexWithVotes = (cardItems: CardItemType[]) =>
	cardItems.findIndex((cardItem) => cardItem.votes.length > 0);

// work around to avoid read only error
const getEditableBoardData = (board: BoardType): BoardType => JSON.parse(JSON.stringify(board));

const getBoardDataQuery = (queryClient: QueryClient, boardQueryKey: QueryKeyType): BoardType =>
	(queryClient.getQueryData(boardQueryKey) as { board: BoardType }).board;

const getPreviousBoardData = (queryClient: QueryClient, boardQueryKey: QueryKeyType) =>
	getEditableBoardData(getBoardDataQuery(queryClient, boardQueryKey));

const getCardItemVotesOptimistic = (
	action: Action,
	prevBoardData: BoardType,
	indexes: number[],
	userId: string
) => {
	const newBoardData = prevBoardData;
	const [colIndex, cardIndex, cardItemIndex] = indexes;

	if (shallAddVote(action)) {
		newBoardData.columns[colIndex].cards[cardIndex].items[cardItemIndex].votes.push(userId);
	} else if (shallRemoveVote(action)) {
		newBoardData.columns[colIndex].cards[cardIndex].items[cardItemIndex].votes.pop();
	}

	return newBoardData;
};

const getCardsVotesOptimistic = (
	action: Action,
	prevBoardData: BoardType,
	indexes: number[],
	userId: string
) => {
	const newBoardData = prevBoardData;
	const [colIndex, cardIndex] = indexes;
	const hasVotesOnMergedCards = newBoardData.columns[colIndex].cards[cardIndex].votes.length > 0;

	if (!hasVotesOnMergedCards) {
		const cardItems = newBoardData.columns[colIndex].cards[cardIndex].items;
		const cardItemIndex = getFirstCardItemIndexWithVotes(cardItems);
		const newIndexes = [colIndex, cardIndex, cardItemIndex];

		return getCardItemVotesOptimistic(action, prevBoardData, newIndexes, userId);
	}

	if (shallAddVote(action)) {
		newBoardData.columns[colIndex].cards[cardIndex].votes.push(userId);
	} else if (shallRemoveVote(action)) {
		newBoardData.columns[colIndex].cards[cardIndex].votes.pop();
	}

	return newBoardData;
};

const getBoardDataOptimistic = (
	action: Action,
	prevBoardData: BoardType,
	indexes: number[],
	isCardGroup: boolean,
	userId: string
) => {
	if (isCardGroup) return getCardsVotesOptimistic(action, prevBoardData, indexes, userId);

	return getCardItemVotesOptimistic(action, prevBoardData, indexes, userId);
};

const updateBoardDataOptimistic = (
	action: Action,
	prevBoardData: BoardType,
	voteData: voteDto,
	userId = ''
) => {
	let [colIndex, cardIndex, cardItemIndex] = [-1, -1, -1];
	const { cardId, cardItemId, isCardGroup } = voteData;

	const foundCardItem = prevBoardData.columns.some((column, indexCol) =>
		column.cards.some(
			(card, indexCard) =>
				card._id === cardId &&
				card.items.some((cardItem, indexCardItem) => {
					const cardItemFound = isCardGroup || cardItem._id === cardItemId;

					if (cardItemFound) {
						[colIndex, cardIndex, cardItemIndex] = [indexCol, indexCard, indexCardItem];
					}

					return cardItemFound;
				})
		)
	);

	if (foundCardItem) {
		const indexes = [colIndex, cardIndex, cardItemIndex];

		return getBoardDataOptimistic(action, prevBoardData, indexes, isCardGroup, userId);
	}

	return prevBoardData;
};

const updateVoteOptimistic = async (
	action: Action,
	queryClient: QueryClient,
	voteData: voteDto,
	userId: string | undefined
) => {
	const boardQueryKey = getBoardQueryKey(voteData.boardId);

	await queryClient.cancelQueries(boardQueryKey);

	const prevBoardData: BoardType = getPreviousBoardData(queryClient, boardQueryKey);

	const newBoardData = updateBoardDataOptimistic(action, prevBoardData, voteData, userId);

	queryClient.setQueryData(boardQueryKey, { board: newBoardData });

	return { newBoardData, prevBoardData };
};

const addVoteOptimistic = async (
	queryClient: QueryClient,
	voteData: voteDto,
	userId: string | undefined
) => updateVoteOptimistic(Action.Add, queryClient, voteData, userId);

const removeVoteOptimistic = async (queryClient: QueryClient, voteData: voteDto) =>
	updateVoteOptimistic(Action.Remove, queryClient, voteData, undefined);

const buildToastMessage = (
	toastMessage: string,
	toastStateType: ToastStateEnum
): ToastStateType => ({ open: true, content: toastMessage, type: toastStateType });

const useVotes = () => {
	const { queryClient, setToastState } = useBoardUtils();
	const { data: session } = useSession({ required: true });
	const userId = session?.user?.id;

	const addVote = useMutation(addVoteRequest, {
		onMutate: async (voteData) => addVoteOptimistic(queryClient, voteData, userId),
		onSettled: (boardDataFromApi) => {
			queryClient.invalidateQueries(getBoardQueryKey(boardDataFromApi?._id));

			if (boardDataFromApi && hasMaxVotesLimit(boardDataFromApi)) {
				const remainingVotes = getRemainingVotes(boardDataFromApi, userId!);

				const toastMessage = `You have ${remainingVotes} votes left`;

				setToastState(buildToastMessage(toastMessage, ToastStateEnum.INFO));
			}
		},
		onError: (_err, voteData, ctx) => {
			queryClient.setQueryData(getBoardQueryKey(voteData.boardId), ctx?.prevBoardData);

			const toastMessage = 'Error adding the vote';

			setToastState(buildToastMessage(toastMessage, ToastStateEnum.ERROR));
		}
	});

	const deleteVote = useMutation(deleteVoteRequest, {
		onMutate: async (voteData) => removeVoteOptimistic(queryClient, voteData),
		onSettled: (boardDataFromApi) => {
			queryClient.invalidateQueries(getBoardQueryKey(boardDataFromApi?._id));

			if (boardDataFromApi && hasMaxVotesLimit(boardDataFromApi)) {
				const remainingVotes = getRemainingVotes(boardDataFromApi, userId!);

				const toastMessage = `Vote removed. You have ${remainingVotes} votes left.`;

				setToastState(buildToastMessage(toastMessage, ToastStateEnum.INFO));
			}
		},
		onError: (_err, voteData, ctx) => {
			queryClient.setQueryData(getBoardQueryKey(voteData.boardId), ctx?.prevBoardData);

			const toastMessage = 'Error deleting the vote';

			setToastState(buildToastMessage(toastMessage, ToastStateEnum.ERROR));
		}
	});

	return {
		addVote,
		deleteVote
	};
};

export default useVotes;
