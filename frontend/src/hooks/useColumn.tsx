import { useMutation } from '@tanstack/react-query';
import BoardType from '@/types/board/board';
import ColumnType from '@/types/column';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { updateColumnRequest } from '@/api/boardService';
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

      // if(prevBoard)
      // updateBoardColumns(data.boardId)

      return { previousBoard: prevBoard, data };
    },
    onSuccess: async (data) => {
      const prevBoard = await getPrevData(data._id);

      if (prevBoard) updateBoardColumns(data._id, data.columns);

      return { previousBoard: prevBoard, data };
    },
    onError: () => {
      // queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error updating the card',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    updateColumn,
  };
};

export default useColumn;
