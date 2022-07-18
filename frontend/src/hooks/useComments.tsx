import { useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

import { addCommentRequest, deleteCommentRequest, updateCommentRequest } from '../api/boardService';
import { ToastStateEnum } from '../utils/enums/toast-types';
import useBoardUtils from './useBoardUtils';
import BoardType from 'types/board/board';
import {
	handleUpdateComments,
	handleDeleteComments,
	handleAddComments
} from 'helper/board/transformBoard';

const useComments = () => {
	const { queryClient, setToastState } = useBoardUtils();
	const { data: session } = useSession({ required: false });

	const addCommentInCard = useMutation(addCommentRequest, {
		onMutate: async (data) => {
			const user = session?.user;
			const query = ['board', { id: data.boardId }];
			await queryClient.cancelQueries(query);

			const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
			const board = prevData?.board;

			if (board) {
				const newBoard = handleAddComments(board, data, user);

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
				content: 'Error updating the comment',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const deleteComment = useMutation(deleteCommentRequest, {
		onMutate: async (data) => {
			const query = ['board', { id: data.boardId }];
			await queryClient.cancelQueries(query);

			const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
			const board = prevData?.board;

			if (board) {
				const newBoard = handleDeleteComments(board, data);

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
				content: 'Error updating the comment',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const updateComment = useMutation(updateCommentRequest, {
		onMutate: async (data) => {
			const query = ['board', { id: data.boardId }];
			await queryClient.cancelQueries(query);

			const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
			const board = prevData?.board;

			if (board) {
				const newBoard = handleUpdateComments(board, data);

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
				content: 'Error updating the comment',
				type: ToastStateEnum.ERROR
			});
		}
	});

	return {
		addCommentInCard,
		deleteComment,
		updateComment
	};
};

export default useComments;
