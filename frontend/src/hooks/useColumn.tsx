import { useMutation } from '@tanstack/react-query';
import BoardType from '@/types/board/board';
import ColumnType from '@/types/column';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { deleteCardsFromColumnRequest, updateColumnRequest } from '@/api/boardService';
import useBoardUtils from './useBoardUtils';

const useColumn = () => {
  const { queryClient, setToastState } = useBoardUtils();

  const getBoardQuery = (id: string | undefined) => ['board', { id }];

  const getPrevData = async (id: string | undefined): Promise<BoardType | undefined> => {
    const query = getBoardQuery(id);
    await queryClient.cancelQueries(query);
    const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
    return prevData?.board;
  };

  const updateBoardColumns = (id: string, columns: ColumnType[]) => {
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(id),
      (old: { board: BoardType } | undefined) => {
        if (old)
          return {
            board: {
              ...old.board,
              columns,
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

        updateBoardColumns(data.boardId, columnsWithUpdate);
      }

      return { previousBoard: prevBoard, data };
    },
    onSuccess: async (data) => {
      const prevBoard = await getPrevData(data._id);

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
    onSuccess: (data) => {
      queryClient.invalidateQueries(['board', { id: data._id }]);
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
