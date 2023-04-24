import { useMutation } from '@tanstack/react-query';

import { deleteCardsFromColumnRequest, updateColumnRequest } from '@/api/boardService';
import { ToastStateEnum } from '@/enums/toasts/toast-types';
import useBoardUtils from '@/hooks/useBoardUtils';
import BoardType from '@/types/board/board';
import { BoardUser } from '@/types/board/board.user';
import ColumnType from '@/types/column';

const useColumn = () => {
  const { queryClient, setToastState } = useBoardUtils();

  const getBoardQuery = (id: string | undefined) => ['board', { id }];

  const getPrevData = async (id: string | undefined): Promise<BoardType | undefined> => {
    const query = getBoardQuery(id);
    await queryClient.cancelQueries(query);
    const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
    return prevData?.board;
  };

  const updateBoard = (id: string, columns: ColumnType[], users: BoardUser[]) => {
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(id),
      (old: { board: BoardType } | undefined) => {
        if (old)
          return {
            board: {
              ...old.board,
              columns,
              users,
            },
          };

        return old;
      },
    );
  };

  const updateColumn = useMutation(updateColumnRequest, {
    onMutate: async (data) => {
      const prevBoard = await getPrevData(data.boardId);

      if (prevBoard) {
        const columnsWithUpdate = prevBoard.columns.map((column) =>
          column._id === data._id
            ? {
                ...data,
              }
            : column,
        );

        updateBoard(data.boardId, columnsWithUpdate, prevBoard.users);
      }

      return { previousBoard: prevBoard, data };
    },
    onSuccess: async (data) => {
      const prevBoard = await getPrevData(data._id);

      updateBoard(data._id, data.columns, data.users);

      return { previousBoard: prevBoard, data };
    },
    onError: (_, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error updating the column',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const deleteCardsFromColumn = useMutation(deleteCardsFromColumnRequest, {
    onSuccess: async (data) => {
      const prevBoard = await getPrevData(data._id);
      updateBoard(data._id, data.columns, data.users);

      return { previousBoard: prevBoard, data };
    },
    onError: (_, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error updating the column',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    updateColumn,
    deleteCardsFromColumn,
  };
};

export default useColumn;
