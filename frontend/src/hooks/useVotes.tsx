import { useMutation } from 'react-query';
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

const useVotes = () => {
	const { queryClient, setToastState } = useBoardUtils();
	const { data: session } = useSession({ required: true });
	const userId = session?.user?.id || '';

	const shallAddVote = (action: Action) => action === Action.Add;
	const shallRemoveVote = (action: Action) => action === Action.Remove;
	const getBoardQueryKey = (boardId = ''): QueryKeyType => ['board', { id: boardId }];
	const hasMaxVotesLimit = ({ maxVotes }: BoardType) => !isEmpty(maxVotes);
	// work around to avoid read only error
	const getEditableBoardData = (board: BoardType): BoardType => JSON.parse(JSON.stringify(board));

	const getFirstCardItemIndexWithVotes = (cardItems: CardItemType[]) =>
		cardItems.findIndex((cardItem) => cardItem.votes.length > 0);

	const getBoardDataQuery = (boardQueryKey: QueryKeyType): BoardType =>
		(queryClient.getQueryData(boardQueryKey) as { board: BoardType }).board;

	const getPreviousBoardData = (boardQueryKey: QueryKeyType) =>
		getEditableBoardData(getBoardDataQuery(boardQueryKey));

	const getCardItemVotesOptimistic = (
		action: Action,
		prevBoardData: BoardType,
		indexes: number[]
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
		indexes: number[]
	) => {
		const newBoardData = prevBoardData;
		const [colIndex, cardIndex] = indexes;
		const hasVotesOnMergedCards =
			newBoardData.columns[colIndex].cards[cardIndex].votes.length > 0;

		if (!hasVotesOnMergedCards) {
			const cardItems = newBoardData.columns[colIndex].cards[cardIndex].items;
			const cardItemIndex = getFirstCardItemIndexWithVotes(cardItems);
			const newIndexes = [colIndex, cardIndex, cardItemIndex];

			return getCardItemVotesOptimistic(action, prevBoardData, newIndexes);
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
		isCardGroup: boolean
	) => {
		if (isCardGroup) return getCardsVotesOptimistic(action, prevBoardData, indexes);

		return getCardItemVotesOptimistic(action, prevBoardData, indexes);
	};

	const updateBoardDataOptimistic = (
		action: Action,
		prevBoardData: BoardType,
		voteData: voteDto
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
							[colIndex, cardIndex, cardItemIndex] = [
								indexCol,
								indexCard,
								indexCardItem
							];
						}

						return cardItemFound;
					})
			)
		);

		if (foundCardItem) {
			const indexes = [colIndex, cardIndex, cardItemIndex];

			return getBoardDataOptimistic(action, prevBoardData, indexes, isCardGroup);
		}

		return prevBoardData;
	};

	const updateVoteOptimistic = async (action: Action, voteData: voteDto) => {
		const boardQueryKey = getBoardQueryKey(voteData.boardId);

		await queryClient.cancelQueries(boardQueryKey);

		const prevBoardData: BoardType = getPreviousBoardData(boardQueryKey);

		const newBoardData = updateBoardDataOptimistic(action, prevBoardData, voteData);

		queryClient.setQueryData(boardQueryKey, { board: newBoardData });

		return { newBoardData, prevBoardData };
	};

	const addVoteOptimistic = async (voteData: voteDto) =>
		updateVoteOptimistic(Action.Add, voteData);

	const removeVoteOptimistic = async (voteData: voteDto) =>
		updateVoteOptimistic(Action.Remove, voteData);

	const buildToastMessage = (
		toastMessage: string,
		toastStateType: ToastStateEnum
	): ToastStateType => ({ open: true, content: toastMessage, type: toastStateType });

	const toastErrorMessage = (errorMessage: string) =>
		setToastState(buildToastMessage(errorMessage, ToastStateEnum.ERROR));

	const toastInfoMessage = (toastMessage: string) =>
		setToastState(buildToastMessage(toastMessage, ToastStateEnum.INFO));

	const toastRemainingVotesMessage = (
		message: string,
		boardDataFromApi: BoardType | undefined
	) => {
		if (boardDataFromApi && hasMaxVotesLimit(boardDataFromApi)) {
			const remainingVotes = getRemainingVotes(boardDataFromApi, userId!);

			toastInfoMessage(`${message} You have ${remainingVotes} votes left.`);
		}
	};
	const restoreBoardDataAndToastError = (
		errorMessage: string,
		{ boardId }: voteDto,
		prevBoardData: BoardType | undefined
	) => {
		queryClient.setQueryData(getBoardQueryKey(boardId), prevBoardData);

		toastErrorMessage(errorMessage);
	};

	const addVote = useMutation(addVoteRequest, {
		onMutate: async (voteData) => addVoteOptimistic(voteData),
		onSettled: (boardDataFromApi) => {
			queryClient.invalidateQueries(getBoardQueryKey(boardDataFromApi?._id));

			toastRemainingVotesMessage('Vote added.', boardDataFromApi);
		},
		onError: (_err, voteData, ctx) =>
			restoreBoardDataAndToastError('Error adding the vote', voteData, ctx?.prevBoardData)
	});

	const deleteVote = useMutation(deleteVoteRequest, {
		onMutate: async (voteData) => removeVoteOptimistic(voteData),
		onSettled: (boardDataFromApi) => {
			queryClient.invalidateQueries(getBoardQueryKey(boardDataFromApi?._id));

			toastRemainingVotesMessage('Vote removed.', boardDataFromApi);
		},
		onError: (_err, voteData, ctx) =>
			restoreBoardDataAndToastError('Error deleting the vote', voteData, ctx?.prevBoardData)
	});

	return {
		addVote,
		deleteVote
	};
};

export default useVotes;
