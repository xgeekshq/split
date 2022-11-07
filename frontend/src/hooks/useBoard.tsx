import { useMutation, useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { AxiosError } from 'axios';

import {
	createBoardRequest,
	deleteBoardRequest,
	getBoardRequest,
	updateBoardRequest
} from 'api/boardService';
import { boardState, newBoardState } from 'store/board/atoms/board.atom';
import BoardType from 'types/board/board';
import UseBoardType from 'types/board/useBoard';
import { ToastStateEnum } from 'utils/enums/toast-types';
import useBoardUtils from './useBoardUtils';

interface AutoFetchProps {
	autoFetchBoard: boolean;
}

const useBoard = ({ autoFetchBoard = false }: AutoFetchProps): UseBoardType => {
	const { boardId, queryClient, setToastState } = useBoardUtils();

	const setBoard = useSetRecoilState(boardState);
	const setNewBoard = useSetRecoilState(newBoardState);
	// #region BOARD

	const fetchBoard = useQuery(['board', { id: boardId }], () => getBoardRequest(boardId), {
		enabled: autoFetchBoard,
		refetchOnWindowFocus: false,
		onError: () => {
			setToastState({
				open: true,
				content: 'Error getting the board',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const createBoard = useMutation(createBoardRequest, {
		onSuccess: (data) => setNewBoard(data),
		onError: () => {
			setToastState({
				open: true,
				content: 'Error creating the board',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const deleteBoard = useMutation(deleteBoardRequest, {
		onSuccess: () => {
			queryClient.invalidateQueries('boards');
			setToastState({
				open: true,
				content: 'The board was successfully deleted.',
				type: ToastStateEnum.SUCCESS
			});
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error deleting the board',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const updateBoard = useMutation(updateBoardRequest, {
		onSuccess: (board: BoardType) => {
			setBoard(board);

			queryClient.invalidateQueries('board');

			setToastState({
				open: true,
				content: 'The board was successfully updated.',
				type: ToastStateEnum.SUCCESS
			});
		},
		onError: (error: AxiosError) => {
			const errorMessage = error.response?.data.message.includes('max votes')
				? error.response?.data.message
				: 'Error updating the board';

			setToastState({
				open: true,
				content: errorMessage,
				type: ToastStateEnum.ERROR
			});
		}
	});

	return {
		fetchBoard,
		createBoard,
		deleteBoard,
		updateBoard
	};
};

export default useBoard;
