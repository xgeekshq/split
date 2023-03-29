import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';

import {
  createBoardRequest,
  deleteBoardRequest,
  duplicateBoardRequest,
  getBoardRequest,
  getBoardsRequest,
  updateBoardPhaseRequest,
  updateBoardRequest,
} from '@/api/boardService';
import { handleNewBoardUser } from '@/helper/board/transformBoard';
import { newBoardState } from '@/store/board/atoms/board.atom';
import { operationsQueueAtom } from '@/store/operations/atom/operations-queue.atom';
import BoardType, { InfiniteBoards, PhaseChangeEventType } from '@/types/board/board';
import { BoardUser } from '@/types/board/board.user';
import UseBoardType from '@/types/board/useBoard';
import { BoardPhases } from '@/utils/enums/board.phases';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import useBoardUtils from './useBoardUtils';

interface AutoFetchProps {
  autoFetchBoard?: boolean;
  autoFetchBoards?: boolean;
}

const useBoard = ({
  autoFetchBoard = false,
  autoFetchBoards = false,
}: AutoFetchProps = {}): UseBoardType => {
  const { boardId, queryClient, setToastState } = useBoardUtils();

  const setNewBoard = useSetRecoilState(newBoardState);
  const setReady = useSetRecoilState(operationsQueueAtom);

  const getBoardQuery = (id: string | undefined) => ['board', { id }];

  const setQueryDataAddBoardUser = (data: BoardUser) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.board),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleNewBoardUser(old.board, data);

          return {
            board: {
              ...old.board,
              users: boardData.users,
            },
          };
        }

        return old;
      },
    );
    setReady(true);
  };

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

  const fetchBoards = useInfiniteQuery(
    ['boards'],
    ({ pageParam = 0 }) => getBoardsRequest(pageParam),
    {
      enabled: autoFetchBoards,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        const { hasNextPage, page } = lastPage;
        if (hasNextPage) return page + 1;
        return undefined;
      },
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the boards',
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

  const duplicateBoard = useMutation(duplicateBoardRequest, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['boards']);

      setToastState({
        open: true,
        content: 'The board was succesfully duplicated',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error duplicating the board',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const deleteBoard = useMutation(deleteBoardRequest, {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['boards'], (oldData: InfiniteData<InfiniteBoards> | undefined) => {
        if (!oldData) return { pages: [], pageParams: [] };

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            boards: page.boards.filter((board) => board._id !== variables.id),
          })),
        };
      });

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
    onError: (error: AxiosError<{ message: string }>) => {
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

  const updateBoardPhaseMutation = useMutation(updateBoardPhaseRequest, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['board', { id: boardId }]);
    },
    onError: (_data, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error updating the phase',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const updateBoardPhase = (board: PhaseChangeEventType) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(board.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          setToastState({
            open: true,
            content: `${
              board.phase === BoardPhases.VOTINGPHASE ? 'Voting phase started on ' : ''
            } ${old.board.title} ${board.phase === BoardPhases.SUBMITTED ? ' was submited' : ''}`,
            type: ToastStateEnum.SUCCESS,
          });
          return {
            board: {
              ...old.board,
              phase: board.phase,
              hideCards: board.hideCards,
              hideVotes: board.hideVotes,
              addCards: board.addCards,
              columns: board.columns,
              submitedAt: board.submitedAt,
            },
          };
        }
        return old;
      },
    );
    setReady(true);
  };

  return {
    createBoard,
    duplicateBoard,
    deleteBoard,
    updateBoard,
    fetchBoard,
    fetchBoards,
    setQueryDataAddBoardUser,
    updateBoardPhase,
    updateBoardPhaseMutation,
  };
};

export default useBoard;
