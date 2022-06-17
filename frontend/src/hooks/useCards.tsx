import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

import { handleUpdateCardPosition } from 'helper/board/transformBoard';
import { mergeCardState } from 'store/mergeCard/atoms/merge-card.atom';
import BoardType from 'types/board/board';
import { ToastStateEnum } from 'utils/enums/toast-types';
import {
	addCardRequest,
	deleteCardRequest,
	mergeBoardRequest,
	mergeCardsRequest,
	removeFromMergeRequest,
	updateCardPositionRequest,
	updateCardRequest
} from '../api/boardService';
import useBoardUtils from './useBoardUtils';

const useCards = () => {
	const { queryClient, setToastState } = useBoardUtils();

	const setMergeCard = useSetRecoilState(mergeCardState);

	const addCardInColumn = useMutation(addCardRequest, {
		onSuccess: () => {
			queryClient.invalidateQueries('board');
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error adding the card',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const updateCardPosition = useMutation(updateCardPositionRequest, {
		onMutate: async (data) => {
			const query = ['board', { id: data.boardId }];
			await queryClient.cancelQueries(query);

			const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
			const board = prevData?.board;

			if (board) {
				const newBoard = handleUpdateCardPosition(board, data);

				queryClient.setQueryData<{ board: BoardType } | undefined>(
					query,
					(old: { board: BoardType } | undefined) => {
						if (old)
							return {
								board: {
									...old.board,
									columns: newBoard.columns
								}
							};

						return old;
					}
				);
			}

			return { previousBoard: board, data };
		},
		onSettled: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);
		},
		onSuccess: () => {},
		onError: (data, variables, context) => {
			queryClient.setQueryData(
				['board', { id: variables.boardId }],
				(context as { previousBoard: BoardType }).previousBoard
			);
			setToastState({
				open: true,
				content: 'Error updating the card position',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const updateCard = useMutation(updateCardRequest, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error updating the card',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const deleteCard = useMutation(deleteCardRequest, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);

			setToastState({
				open: true,
				type: ToastStateEnum.SUCCESS,
				content: 'Card deleted with success!'
			});
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error deleting the card',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const mergeBoard = useMutation(mergeBoardRequest, {
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(['board', { id: variables }]);
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error mergint the board',
				type: ToastStateEnum.ERROR
			});
		}
	});

	// #region MERGE_CARDS

	const mergeCards = useMutation(mergeCardsRequest, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);
		},
		onError: () => {
			setMergeCard(undefined);
			setToastState({
				open: true,
				content: 'Error merging the cards',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const removeFromMergeCard = useMutation(removeFromMergeRequest, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error unmerge the card',
				type: ToastStateEnum.ERROR
			});
		}
	});

	// #endregion

	return {
		addCardInColumn,
		updateCardPosition,
		updateCard,
		deleteCard,
		mergeCards,
		removeFromMergeCard,
		mergeBoard
	};
};

export default useCards;
