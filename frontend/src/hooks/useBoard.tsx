import { InfiniteData, useMutation, useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { AxiosError } from 'axios';

import {
  createBoardRequest,
  deleteBoardRequest,
  getBoardRequest,
  updateBoardRequest,
} from '@/api/boardService';
import { newBoardState } from '@/store/board/atoms/board.atom';
import UseBoardType from '@/types/board/useBoard';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import BoardType, { UpdateBoardPhase } from '@/types/board/board';
import { BoardPhases } from '@/utils/enums/board.phases';
import { operationsQueueAtom } from '@/store/operations/atom/operations-queue.atom';
import useBoardUtils from './useBoardUtils';

interface AutoFetchProps {
  autoFetchBoard: boolean;
}

const useBoard = ({ autoFetchBoard = false }: AutoFetchProps): UseBoardType => {
  const { boardId, queryClient, setToastState } = useBoardUtils();

  const setNewBoard = useSetRecoilState(newBoardState);
  // #region BOARD

  const setReady = useSetRecoilState(operationsQueueAtom);

  const fetchBoard = useQuery(['board', { id: boardId }], () => getBoardRequest(boardId), {
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
  });

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

  const updateBoardPhase = (data: UpdateBoardPhase) => {
    setReady(false);
    const getBoardQuery = (id: string | undefined) => ['board', { id }];
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          setToastState({
            open: true,
            content: `${data.phase === BoardPhases.VOTINGPHASE ? 'Voting phase started on ' : ''} ${
              old.board.title
            } ${data.phase === BoardPhases.SUBMITED ? ' was submited' : ''}`,
            type: ToastStateEnum.SUCCESS,
          });
          return {
            board: {
              ...old.board,
              phase: data.phase,
            },
          };
        }
        return old;
      },
    );
    setReady(true);
  };

  return {
    fetchBoard,
    createBoard,
    deleteBoard,
    updateBoard,
    updateBoardPhase,
  };
};

export default useBoard;
