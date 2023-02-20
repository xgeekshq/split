import { InfiniteData, useMutation, useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { AxiosError } from 'axios';

import {
  createBoardRequest,
  deleteBoardRequest,
  getBoardRequest,
  updateBoardRequest,
  getPublicBoardRequest,
} from '@/api/boardService';
import { newBoardState } from '@/store/board/atoms/board.atom';
import UseBoardType from '@/types/board/useBoard';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import BoardType from '@/types/board/board';
import useBoardUtils from './useBoardUtils';

interface AutoFetchProps {
  autoFetchBoard: boolean;
}

const useBoard = ({ autoFetchBoard = false }: AutoFetchProps): UseBoardType => {
  const { boardId, queryClient, setToastState, userId, session } = useBoardUtils();

  const setNewBoard = useSetRecoilState(newBoardState);
  // #region BOARD

  const fetchBasedBoard = useQuery(
    ['board', { id: boardId }],
    () => {
      if (!session && userId) {
        return getPublicBoardRequest({ boardId, userId });
      }
      return getBoardRequest(boardId);
    },
    {
      enabled: autoFetchBoard,
      refetchOnWindowFocus: true,
      onError: () => {
        queryClient.invalidateQueries(['board', { id: boardId }]);
        setToastState({
          open: true,
          content: 'Error getting the board',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );

  const createBoard = useMutation(createBoardRequest, {
    onSuccess: (data) => setNewBoard(data._id),
    onError: () => {
      setToastState({
        open: true,
        content: 'Error creating the board',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const deleteBoard = useMutation(deleteBoardRequest, {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['boards'],
        (
          oldData:
            | InfiniteData<{
                boards: BoardType[];
                hasNextPage: boolean;
                page: number;
              }>
            | undefined,
        ) => {
          if (!oldData) return { pages: [], pageParams: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              boards: page.boards.filter((board) => board._id !== variables.id),
            })),
          };
        },
      );

      queryClient.invalidateQueries(['boards']);

      setToastState({
        open: true,
        content: 'The board was successfully deleted.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error deleting the board',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const updateBoard = useMutation(updateBoardRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['board', { id: boardId }]);

      setToastState({
        open: true,
        content: 'The board was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: (error: AxiosError) => {
      queryClient.invalidateQueries(['board', { id: boardId }]);
      const errorMessage = error.response?.data.message.includes('max votes')
        ? error.response?.data.message
        : 'Error updating the board';

      setToastState({
        open: true,
        content: errorMessage,
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    createBoard,
    deleteBoard,
    updateBoard,
    fetchBasedBoard,
  };
};

export default useBoard;
